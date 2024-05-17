import { ManifestV3Export } from '@crxjs/vite-plugin';

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'Browser Extension TypeScript & React Starter',
  description: 'Browser Extension, TypeScript, React',
  version: '0.1',
  background: {
    service_worker: 'src/background/index.ts',
  },
  content_scripts: [
    {
      matches: ['https://twitter.com/*', 'https://x.com/*'],
      js: ['src/content/index.tsx'],
      run_at: 'document_end',
    },
  ],
  host_permissions: ['https://twitter.com/*', 'https://x.com/*'],
  options_ui: {
    page: 'src/options/options.html',
    open_in_tab: true,
  },
  web_accessible_resources: [
    {
      resources: [
        // this file is web accessible; it supports HMR b/c it's declared in `rollupOptions.input`
        'src/welcome/welcome.html',
      ],
      matches: ['https://twitter.com/*', 'https://x.com/*'],
    },
  ],
  action: {
    default_popup: 'src/popup/popup.html',
    default_icon: {
      '16': 'images/extension_16.png',
      '32': 'images/extension_32.png',
      '48': 'images/extension_48.png',
      '128': 'images/extension_128.png',
    },
  },
  icons: {
    '16': 'images/extension_16.png',
    '32': 'images/extension_32.png',
    '48': 'images/extension_48.png',
    '128': 'images/extension_128.png',
  },
  // https://developer.chrome.com/docs/extensions/reference/api/cookies?hl=zh-cn
  // 这里目前是从document里面读字体，并且没有添加cookies的permission，是生效的。
  // 真实情况可能是chrome.cookies.getAll() 暂时先保留TODO
  permissions: ['storage', 'tabs', 'cookies'],
};

export default manifest;
