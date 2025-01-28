import { transform } from 'typedoc-better-json';
import { writeFile, readFile } from 'node:fs/promises';

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fileContent = await readFile(resolve(__dirname, '../', 'json', 'docs.json'), 'utf8');
const fileData = JSON.parse(fileContent);
const transformedData = transform(fileData);

await writeFile('./docs.json', JSON.stringify(transformedData, null, 2));
