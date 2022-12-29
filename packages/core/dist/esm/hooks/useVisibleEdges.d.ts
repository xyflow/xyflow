import type { NodeInternals, Edge } from '../types';
declare function useVisibleEdges(onlyRenderVisible: boolean, nodeInternals: NodeInternals, elevateEdgesOnSelect: boolean): {
    edges: Edge<any>[];
    level: number;
    isMaxLevel: boolean;
}[];
export default useVisibleEdges;
//# sourceMappingURL=useVisibleEdges.d.ts.map