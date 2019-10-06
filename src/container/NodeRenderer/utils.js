import DefaultNode from '../../components/Nodes/DefaultNode';
import InputNode from '../../components/Nodes/InputNode';
import OutputNode from '../../components/Nodes/OutputNode';
import wrapNode from '../../components/Nodes/wrapNode';

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
