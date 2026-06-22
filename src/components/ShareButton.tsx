import React, {useCallback, useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// One-click "Copy share link" button. Mints <current-url>?key=<password>, which
// the gate in src/theme/Root.tsx auto-consumes (it unlocks, then strips the
// param out of the URL). This lets you share a page without anyone having to
// know or type the password.
//
// Reads the SAME customFields.wikiPassword the gate reads, so the two can't
// drift. Renders nothing when no password is configured (ungated portal), so it
// is safe to ship dormant in the template.
const SHARE_PARAM = 'key';

export default function ShareButton(): React.ReactElement | null {
  const {siteConfig} = useDocusaurusContext();
  const password = String(siteConfig.customFields?.wikiPassword ?? '').trim();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (typeof window === 'undefined' || !password) return;

    const url = new URL(window.location.href);
    url.searchParams.set(SHARE_PARAM, password);
    const shareUrl = url.toString();

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link:', shareUrl);
    }
  }, [password]);

  // No password → no gate → nothing to share. Stay invisible.
  if (!password) return null;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '0 0 1rem',
      }}
    >
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy share link"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.4rem 0.85rem',
          fontSize: '0.85rem',
          fontWeight: 500,
          border: '1px solid var(--ifm-color-emphasis-300)',
          borderRadius: '6px',
          background: 'var(--ifm-background-surface-color)',
          color: 'var(--ifm-color-emphasis-800)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'background 0.15s, border-color 0.15s',
        }}
      >
        <span aria-hidden="true">{copied ? '✓' : '🔗'}</span>
        <span>{copied ? 'Link copied' : 'Copy share link'}</span>
      </button>
    </div>
  );
}
