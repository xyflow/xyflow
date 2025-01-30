import { FunctionParser, ProjectParser } from 'typedoc-json-parser';
import { writeOutputJSON } from '../utils.js';

export async function parseComponent(project: ProjectParser, item: FunctionParser) {
  const { name, source, title, description, examples } = parseMetaInfo(item);
  const signature = item.signatures[0];
  const parameters = signature.parameters.map((param) => {
    let properties = param.type.properties;

    if (param.type.kind === 'reference') {
      properties = project.find(param.type.id)?.type?.properties;
    }

    const propertiesClean = properties?.map?.((p) => {
      const { blockTags } = p.comment;
      const description = blockTags?.find((c) => c.name === 'description')?.text;
      const example = blockTags?.find((c) => c.name === 'example')?.text;
      const defaultValue = blockTags?.find((c) => c.name === 'default')?.text;

      delete p.comment;

      return {
        ...p,
        description,
        example,
        defaultValue,
        typeString: p.type.toString(),
      };
    });

    return {
      name: param.name,
      typeString: param.type.toString(),
      kind: param.type.kind,
      properties: propertiesClean,
    };
  });

  const output = {
    name,
    source,
    title,
    description,
    examples,
    parameters,
  };

  await writeOutputJSON(`components/${name}.json`, output);
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
