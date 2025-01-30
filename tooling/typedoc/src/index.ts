import { initFolders, readTypedocJSON } from './utils.js';
import { Parser } from './parser.js';

await initFolders();

const typedocJSON = await readTypedocJSON();
const parser = new Parser(typedocJSON);

parser.start();
