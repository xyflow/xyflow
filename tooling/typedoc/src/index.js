import { initFolders, createDataStucture } from './utils.js';
import { parseType, parseComponent, parseHook, parseUtilFunction } from './parser.js';

await initFolders();
const data = await createDataStucture();

data.types.forEach(parseType);
data.components.forEach(parseComponent);
data.hooks.forEach(parseHook);
data.utils.forEach(parseUtilFunction);
