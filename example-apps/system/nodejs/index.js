import { isNodeBase } from '@xyflow/system';

const node = { id: 'node.id', x: 0, y: 0, data: { label: 'Node 1' }, position: { x: 0, y: 0 } };
const notANode = { a: 'a', b: 0, c: true };

console.log(isNodeBase(node));
console.log(isNodeBase(notANode));
