import { EnumParser, FunctionParser, InterfaceParser, ProjectParser, TypeAliasParser } from 'typedoc-json-parser';
import { writeOutputJSON } from '../utils.js';

export async function parseType(project: ProjectParser, item: InterfaceParser | EnumParser | TypeAliasParser) {
  const { name, source, title, description, examples } = parseMetaInfo(item);
  const properties =
    item.type?.properties?.map((p) => ({
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
    type: item.type,
    typeString: item.type?.toString(),
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
