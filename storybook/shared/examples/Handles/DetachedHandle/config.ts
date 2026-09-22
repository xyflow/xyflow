import { defaultFlowProps } from '../../../defaultFlow';
export const initialNodes = defaultFlowProps.nodes.map((node) => ({ ...node, type: 'detached' }));
