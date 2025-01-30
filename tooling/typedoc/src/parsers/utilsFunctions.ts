import { FunctionParser, ProjectParser } from 'typedoc-json-parser';
import { writeOutputJSON } from '../utils.js';

export async function parseUtilFunction(project: ProjectParser, item: FunctionParser) {
  await writeOutputJSON(`utils/${item.name}.json`, item);
}
