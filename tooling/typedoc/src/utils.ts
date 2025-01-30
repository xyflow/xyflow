import { mkdir, rm, readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUTPUT_FOLDER = resolve(__dirname, '..', 'output/parser');

export async function initFolders() {
  // await rm(OUTPUT_FOLDER, { recursive: true });
  await mkdir(resolve(OUTPUT_FOLDER, 'types'), { recursive: true });
  await mkdir(resolve(OUTPUT_FOLDER, 'components'), { recursive: true });
  await mkdir(resolve(OUTPUT_FOLDER, 'hooks'), { recursive: true });
  await mkdir(resolve(OUTPUT_FOLDER, 'utils'), { recursive: true });
}

export async function readTypedocJSON() {
  const typedocJSONString = await readFile(resolve(__dirname, '../', 'output/typedoc', 'docs.json'), 'utf8');
  return JSON.parse(typedocJSONString);
}

export async function writeOutputJSON(filePath, data) {
  await writeFile(resolve(OUTPUT_FOLDER, filePath), JSON.stringify(data, null, 2));
}
