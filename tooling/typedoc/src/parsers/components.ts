import { FunctionParser, ProjectParser, ReferenceTypeParser, TypeParser } from 'typedoc-json-parser';
import slugify from '@sindresorhus/slugify';

import { writeOutputJSON } from '../utils.js';

export async function parseComponent(project: ProjectParser, item: FunctionParser) {
  const metaInfo = parseMetaInfo(item);
  const signature = item.signatures[0];
  const parameters = signature.parameters.map((param) => {
    let paramType = param.type;

    if (param.type.kind === TypeParser.Kind.Reference) {
      paramType = project.find(param.type.id)?.type;
    }

    const propertiesClean = paramType?.properties?.map?.((p) => {
      const { comment, ...rest } = p;
      const description = comment.blockTags?.find((c) => c.name === 'description')?.text;
      const example = comment.blockTags?.find((c) => c.name === 'example')?.text;
      const defaultValue = comment.blockTags?.find((c) => c.name === 'default')?.text;

      return {
        ...rest,
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
    ...metaInfo,
    parameters,
  };

  await writeOutputJSON(`components/${metaInfo.name}.json`, output);
}

function parseMetaInfo(item) {
  const { name, comment, source } = item;

  return {
    name,
    source: source.url,
    slug: slugify(name),
    description: comment.description,
    examples: comment.example,
  };
}
