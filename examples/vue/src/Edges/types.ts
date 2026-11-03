import type { DefaultEdge, EdgeProps } from '@xyflow/vue';

export type CustomEdge2 = DefaultEdge<{ text: string }, 'custom2'>;

export type CustomEdge2Props = EdgeProps<CustomEdge2>;

type BuiltinEdge = DefaultEdge<Record<string, unknown>, 'smoothstep' | 'step' | 'straight' | 'custom'>;

export type AppEdge = BuiltinEdge | CustomEdge2;
