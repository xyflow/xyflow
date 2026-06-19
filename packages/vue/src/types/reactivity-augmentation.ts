import type { Edge } from './edge';
import type { Node } from './node';

// `ref<Node[]>` / `ref<Edge[]>` is the canonical way to hold flow state, but Vue's `UnwrapRef` recursively
// walks the entire (large) `Node`/`Edge` type — including `style`'s `CSSProperties` — so a single
// `nodes.value = nodes.value.map((n) => ({ ...n }))` balloons to ~400k type instantiations and flakily
// trips TS's instantiation-depth limit (`TS2589`) in long-running editor type-checkers. Nodes/edges hold
// no refs, so unwrapping is pure overhead: bail out of it via `RefUnwrapBailTypes` (the same hook Vue itself
// uses to bail DOM `Node`/`Window`). The minimal `Pick` shapes match every node/edge — including custom
// `data` generics — while sidestepping the `label` self-reference that listing the full `Edge` type triggers.
declare module '@vue/reactivity' {
  interface RefUnwrapBailTypes {
    vueFlowNode: Pick<Node, 'id' | 'position'>;
    vueFlowEdge: Pick<Edge, 'id' | 'source' | 'target'>;
  }
}
