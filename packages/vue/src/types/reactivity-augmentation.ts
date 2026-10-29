import type { Edge } from './edge';
import type { Node } from './node';

// Bail `UnwrapRef` out of `Node`/`Edge` via `RefUnwrapBailTypes`: they hold no refs, so unwrapping is pure
// overhead that recursively walks the large types and trips TS2589. Minimal `Pick`s avoid `label`'s self-ref.
declare module '@vue/reactivity' {
  interface RefUnwrapBailTypes {
    vueFlowNode: Pick<Node, 'id' | 'position'>;
    vueFlowEdge: Pick<Edge, 'id' | 'source' | 'target'>;
  }
}
