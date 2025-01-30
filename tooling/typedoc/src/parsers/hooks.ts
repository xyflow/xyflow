import { FunctionParser, ProjectParser } from 'typedoc-json-parser';
import { writeOutputJSON } from '../utils.js';

export async function parseHook(project: ProjectParser, item: FunctionParser) {
  const name = item.name;
  const source = item.source.url;

  if (item.signatures.length > 1) {
    console.warn(`Multiple signatures found for hook ${name}`);
    // TODO: Overload Signatures
  }

  const signature = item.signatures[0];

  const description = signature.comment.description;
  const examples = signature.comment.example;

  // Parsing the props
  const hookParameters = [];
  const parameters = signature.parameters;

  const output = {
    name,
    source,
    description,
    examples,
    item,
  };
  await writeOutputJSON(`hooks/${item.name}.json`, output);
}
