import { mkdir, readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { ProjectParser } from 'typedoc-json-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUTPUT_FOLDER = resolve(__dirname, '..', 'output');

export async function initFolders() {
  await mkdir(resolve(OUTPUT_FOLDER, 'types'), { recursive: true });
  await mkdir(resolve(OUTPUT_FOLDER, 'components'), { recursive: true });
  await mkdir(resolve(OUTPUT_FOLDER, 'hooks'), { recursive: true });
  await mkdir(resolve(OUTPUT_FOLDER, 'utils'), { recursive: true });
}

export async function createDataStucture() {
  const typedocJSONString = await readFile(resolve(__dirname, '../', 'json', 'docs.json'), 'utf8');
  const typedocJSON = JSON.parse(typedocJSONString);
  const project = new ProjectParser({ data: typedocJSON, dependencies: {} });

  const data = {
    types: [...project.enums, ...project.interfaces, ...project.typeAliases],
    components: [],
    hooks: [],
    utils: [],
  };

  project.functions.forEach((func) => {
    if (func.name === 'Background') {
      console.log(func.comment.blockTags);
      console.log(func);
    }

    if (func.name.startsWith('use')) {
      data.hooks.push(func);
    } else if (/^[A-Z]/.test(func.name)) {
      data.components.push(func);
    } else {
      data.utils.push(func);
    }
  });

  return data;
}

export async function writeOutputJSON(filePath, data) {
  await writeFile(resolve(OUTPUT_FOLDER, filePath), JSON.stringify(data, null, 2));
}
