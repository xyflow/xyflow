import DefaultNode from './NodeTypes/DefaultNode';
import InputNode from './NodeTypes/InputNode';
import OutputNode from './NodeTypes/OutputNode';
import wrapNode from './NodeTypes/wrapNode';

export function createNodeTypes(nodeTypes) {
  const standardTypes = {
    input: wrapNode(nodeTypes.input || InputNode),
    default: wrapNode(nodeTypes.default || DefaultNode),
    output: wrapNode(nodeTypes.output || OutputNode)
  };

  const specialTypes = Object
    .keys(nodeTypes)
    .filter(k => !['input', 'default', 'output'].includes(k))
    .reduce((res, key) => {
      res[key] = wrapNode(nodeTypes[key] || DefaultNode);

      return res;
    }, {});

  return {
    ...standardTypes,
    ...specialTypes
  };
}
