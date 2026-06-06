import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  brandSidebar: [
    'index',
    {
      type: 'category',
      label: 'Identity',
      collapsed: false,
      items: ['logos', 'color', 'type', 'voice'],
    },
    {
      type: 'category',
      label: 'Generation',
      collapsed: false,
      items: ['golden-atomic-brand-references', 'generation-layer'],
    },
  ],
};

export default sidebars;
