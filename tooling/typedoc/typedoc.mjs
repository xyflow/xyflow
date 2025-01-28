import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const reactFlowPath = resolve(__dirname, '..', '..', 'packages/react');

/** @type {Partial<import("typedoc").TypeDocOptions>} */
const config = {
  entryPoints: [resolve(reactFlowPath, 'src/index.ts')],
  tsconfig: resolve(reactFlowPath, 'tsconfig.json'),
  excludeExternals: true,
  plugin: ['typedoc-plugin-markdown', 'typedoc-plugin-frontmatter', './plugins/custom-plugin.mjs'],
  outputs: [
    {
      name: 'json',
      path: './json/docs.json',
    },
    {
      name: 'markdown',
      path: './docs',
    },
  ],
  groupReferencesByType: true,

  // markdown plugin options
  // flattenOutputFiles: true,
  fileExtension: '.mdx',
  hidePageHeader: true,
  hideBreadcrumbs: true,
  hidePageTitle: true,
  useCodeBlocks: true,
  typeDeclarationVisibility: 'verbose',
  expandObjects: true,
  expandParameters: true,
  blockTagsPreserveOrder: ['@example'],

  // frontmatter plugin options
  frontmatterCommentTags: ['title', 'description'],
};

export default config;
