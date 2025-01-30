import { EnumParser, FunctionParser, InterfaceParser, ProjectParser, TypeAliasParser } from 'typedoc-json-parser';
import { writeOutputJSON } from '../utils.js';

export async function parseType(project: ProjectParser, item: InterfaceParser | EnumParser | TypeAliasParser) {
  const { name, source, title, description, examples } = parseMetaInfo(item);

  let collection = {};

  if (item instanceof InterfaceParser) {
  } else if (item instanceof EnumParser) {
  } else {
    const type = item.type;

    const properties =
      item.type.properties?.map((p) => ({
        ...p,
        typeString: p.type?.toString(),
      })) ?? null;
    // const type = item.type;
    const typeString = item.type.toString();
    collection = { properties, typeString, type };
  }

  const output = {
    name,
    source,
    title,
    description,
    examples,
    ...collection,
  };

  await writeOutputJSON(`types/${name}.json`, output);
}

function parseMetaInfo(item) {
  const name = item.name;
  const description = item.comment.description;
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
