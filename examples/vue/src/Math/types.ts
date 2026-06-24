// `interface … extends Record<string, unknown>` keeps the `interface` style (eslint) while satisfying
// `Node`'s `NodeData extends Record<string, unknown>` constraint (a plain `interface` has no index signature).
export interface ValueNodeData extends Record<string, unknown> {
  value: number;
}

export type Operator = '+' | '-' | '*' | '/';

export interface OperatorNodeData extends Record<string, unknown> {
  operator: Operator;
}
