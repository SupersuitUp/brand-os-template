import React, {useState, useEffect, type FormEvent} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// OPTIONAL client-side gate for the brand portal's human-browsable pages.
//
// This is OPT-IN: it does nothing until you set `customFields.wikiPassword` in
// docusaurus.config.ts. With no password set, `gateDisabled` is true and the
// site renders normally (and the per-page ShareButton stays hidden). Set a
// password and the gate + share buttons both activate.
//
// NOTE: this only gates the rendered Docusaurus pages. Direct fetches of static
// assets (/brand.txt, /brand/**) bypass React entirely and stay reachable, so
// agents priming on the brand still work — which is intended.
// Bump _vN to invalidate saved unlocks on password rotation.
const STORAGE_KEY = 'brand_os_auth_v1';
const SHARE_PARAM = 'key';

export default function Root({children}: {children: React.ReactNode}): React.ReactElement | null {
  const {siteConfig} = useDocusaurusContext();
  const passwordLower = String(siteConfig.customFields?.wikiPassword ?? '').trim().toLowerCase();
  const gateDisabled = passwordLower === '';

  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(gateDisabled);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (gateDisabled) return;
    if (typeof window === 'undefined') return;

    try {
      const params = new URLSearchParams(window.location.search);
      const sharedKey = params.get(SHARE_PARAM);
      if (sharedKey && sharedKey.trim().toLowerCase() === passwordLower) {
        try {
          window.localStorage.setItem(STORAGE_KEY, 'yes');
        } catch {
          // localStorage unavailable — still unlock for this session
        }
        setAuthed(true);

        params.delete(SHARE_PARAM);
        const remaining = params.toString();
        const cleaned =
          window.location.pathname +
          (remaining ? `?${remaining}` : '') +
          window.location.hash;
        window.history.replaceState({}, '', cleaned);
        return;
      }

      if (window.localStorage.getItem(STORAGE_KEY) === 'yes') {
        setAuthed(true);
      }
    } catch {
      // localStorage unavailable (private mode, etc.) — stay locked
    }
  }, [gateDisabled, passwordLower]);

  if (!mounted) {
    return null;
  }

  if (!authed) {
    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      if (input.trim().toLowerCase() === passwordLower) {
        try {
          window.localStorage.setItem(STORAGE_KEY, 'yes');
        } catch {
          // ignore — session-only auth still works in-memory
        }
        setAuthed(true);
        setError(false);
      } else {
        setError(true);
      }
    };

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          background: '#050505',
          color: '#F3F3F3',
          zIndex: 9999,
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            maxWidth: '380px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            textAlign: 'center',
          }}
        >
          {/* Replace with your brand wordmark/lockup. Accent color is a placeholder. */}
          <div
            aria-hidden
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontWeight: 900,
              fontSize: '2.6rem',
              lineHeight: 1,
              letterSpacing: '0.04em',
            }}
          >
            {'{{BRAND MARK}}'}
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#9A9AA0',
              fontWeight: 500,
            }}
          >
            {'{{BRAND NAME}}'} · Brand OS
          </p>
          <input
            type="password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(false);
            }}
            autoFocus
            aria-label="Password"
            placeholder="Password"
            style={{
              padding: '0.75rem 0',
              fontSize: '1rem',
              border: 'none',
              borderBottom: '1px solid #2D2D31',
              borderRadius: 0,
              background: 'transparent',
              color: 'inherit',
              outline: 'none',
              fontFamily: 'inherit',
              textAlign: 'center',
            }}
          />
          {error && (
            <div
              role="alert"
              style={{
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#FF5247',
              }}
            >
              Wrong
            </div>
          )}
          <button
            type="submit"
            style={{
              padding: '0.8rem 1.5rem',
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 600,
              border: '1px solid #DFFF00',
              borderRadius: 0,
              background: '#DFFF00',
              color: '#050505',
              cursor: 'pointer',
            }}
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
