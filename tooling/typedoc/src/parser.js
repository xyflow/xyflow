import { writeOutputJSON } from './utils.js';

export async function parseType(typeAlias) {
  const { name, source, title, description, examples } = parseMetaInfo(typeAlias);
  const properties =
    typeAlias.type?.properties?.map((p) => ({
      ...p,
      typeString: p.type?.toString(),
    })) ?? null;

  const output = {
    name,
    source,
    title,
    description,
    examples,
    properties,
    type: typeAlias.type,
    typeString: typeAlias.type?.toString(),
  };

  await writeOutputJSON(`types/${name}.json`, output);
}

export async function parseComponent(func) {
  const { name, source, title, description, examples } = parseMetaInfo(func);

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

  await writeOutputJSON(`components/${name}.json`, output);
}

export async function parseHook(hook) {
  await writeOutputJSON(`hooks/${hook.name}.json`, hook);
}

export async function parseUtilFunction(utilFunction) {
  await writeOutputJSON(`utils/${utilFunction.name}.json`, utilFunction);
}

export function parseMetaInfo(item) {
  const name = item.name;
  const description = item.description;
  const source = item.source.url;
  const title = item.comment.blockTags.find((c) => c.name === 'title')?.text;
  const examples = item.comment.example;

  return {
    name,
    source,
    title,
    description,
    examples,
  };
}
