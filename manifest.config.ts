import { defineManifest } from '@crxjs/vite-plugin';
import packageJson from './package.json';

const { version } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/);

export default defineManifest(async (env) => ({
  manifest_version: 3,
  name: env.mode === 'staging' ? '[INTERNAL] JSONX' : 'JSONX',
  description: 'JSON 可视化工具',
  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in "version_name"
  version_name: version,
  content_scripts: [],
  options_page: 'index.html',
  action: {
    default_popup: 'index.html',
    default_icon: {
      '16': 'icon16.png',
      '48': 'icon48.png',
      '128': 'icon128.png'
    }
  },
  background: {
    service_worker: 'src/background.ts',
    type: 'module'
  },
  icons: {
    '16': 'icon16.png',
    '48': 'icon48.png',
    '128': 'icon128.png'
  },
  permissions: [
    'storage',
  ],
}));