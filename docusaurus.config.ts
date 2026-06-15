import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Brand OS Template portal. Replace {{PLACEHOLDER}}s with your brand.
// The asset package lives under static/brand/ and is served at /brand/...

const config: Config = {
  title: '{{BRAND NAME}} Brand OS',
  tagline: '{{TAGLINE}}',
  favicon: 'img/favicon.ico',

  future: {v4: true, faster: true},

  url: 'https://{{your-domain}}',
  baseUrl: '/',
  organizationName: '{{org}}',
  projectName: '{{repo}}',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {defaultLocale: 'en', locales: ['en']},

  plugins: [
    // Tailwind v4 via the Docusaurus PostCSS hook.
    function tailwindPlugin() {
      return {
        name: 'tailwind-plugin',
        configurePostCss(postcssOptions: {plugins: unknown[]}) {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          postcssOptions.plugins.push(require('@tailwindcss/postcss'));
          return postcssOptions;
        },
      };
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {sidebarPath: './sidebars.ts', routeBasePath: '/'},
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/og-card.png',
    metadata: [
      {name: 'description', content: '{{BRAND NAME}} Brand OS — the machine-consumable brand system.'},
      {property: 'og:title', content: '{{BRAND NAME}} Brand OS'},
      {property: 'og:description', content: '{{TAGLINE}}'},
      {name: 'twitter:card', content: 'summary_large_image'},
    ],
    // If your brand has a single ground (e.g. paper), consider disableSwitch: true.
    colorMode: {defaultMode: 'light', respectPrefersColorScheme: false},
    navbar: {
      title: '{{BRAND NAME}} Brand OS',
      logo: {alt: '{{BRAND NAME}} mark', src: 'img/logo.png'},
      items: [
        {type: 'docSidebar', sidebarId: 'brandSidebar', position: 'left', label: 'Brand OS'},
        {href: 'https://github.com/{{org}}/{{repo}}', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {title: 'The Brand OS', items: [
          {label: 'Start here', to: '/'},
          {label: 'Logo matrix', to: '/logos'},
          {label: 'Color', to: '/color'},
          {label: 'Type', to: '/type'},
        ]},
        {title: 'Generation', items: [
          {label: 'Golden Atomic Brand References', to: '/golden-atomic-brand-references'},
          {label: 'Generation layer', to: '/generation-layer'},
          {label: 'Voice', to: '/voice'},
        ]},
      ],
      copyright: `{{LOCKUP}} — Brand OS built with Docusaurus.`,
    },
    prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula},
  } satisfies Preset.ThemeConfig,
};

export default config;
