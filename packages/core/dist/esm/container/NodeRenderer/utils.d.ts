import type { NodeTypes, NodeTypesWrapped, NodeOrigin, XYPosition } from '../../types';
export declare type CreateNodeTypes = (nodeTypes: NodeTypes) => NodeTypesWrapped;
export declare function createNodeTypes(nodeTypes: NodeTypes): NodeTypesWrapped;
export declare const getPositionWithOrigin: ({ x, y, width, height, origin, }: {
    x: number;
    y: number;
    width: number;
    height: number;
    origin: NodeOrigin;
}) => XYPosition;
//# sourceMappingURL=utils.d.ts.map