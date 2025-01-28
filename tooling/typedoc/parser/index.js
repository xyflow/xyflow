import { writeFile, mkdir } from 'fs/promises';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { ProjectParser } from 'typedoc-json-parser';

const data = JSON.parse(readFileSync(resolve(__dirname, '../', 'json', 'docs.json'), 'utf8'));

const project = new ProjectParser({ data, dependencies: {} });

await mkdir(resolve(__dirname, 'json'), { recursive: true });
await mkdir(resolve(__dirname, 'json', 'types'), { recursive: true });
await mkdir(resolve(__dirname, 'json', 'functions'), { recursive: true });

for (const typeAlias of project.typeAliases) {
  await parseTypeAliases(typeAlias);
}

for (const func of project.functions) {
  await parseFunction(func);
}

// typeAlias
async function parseTypeAliases(typeAlias) {
  const name = typeAlias.name;
  const source = typeAlias.source.url;
  const title = typeAlias.comment.blockTags.find((c) => c.name === 'title')?.text;
  const description = typeAlias.comment.blockTags.find((c) => c.name === 'description')?.text;
  const examples = typeAlias.comment.example;
  const properties =
    typeAlias.type.properties?.map((p) => ({
      ...p,
      type: p.type.toString(),
    })) ?? null;

  const output = {
    name,
    source,
    title,
    description,
    examples,
    properties,
  };

  await writeFile(resolve(__dirname, 'json', 'types', `${name}.json`), JSON.stringify(output, null, 2));
}

// functions
async function parseFunction() {
  const func = project.functions.find((f) => f.name === 'ReactFlow');

  const name = func.name;
  const source = func.source.url;
  const title = func.comment.blockTags.find((c) => c.name === 'title')?.text;
  const description = func.comment.blockTags.find((c) => c.name === 'description')?.text;
  const examples = func.comment.example;
  const signature = func.signatures[0];

  const output = {
    name,
    source,
    title,
    description,
    examples,
    parameters: signature.parameters.map((p) => ({
      ...p,
      type: p.type.toJSON(),
    })),
    returnType: signature.returnType.toString(),
  };

  await writeFile(resolve(__dirname, 'json', 'functions', `${name}.json`), JSON.stringify(output, null, 2));
}
