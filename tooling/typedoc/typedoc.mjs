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
  outputs: [
    {
      name: 'json',
      path: './output/typedoc/docs.json',
    },
  ],
  groupReferencesByType: true,
};

export default config;
