export enum ErrorCode {
  MISSING_STYLES = 'MISSING_STYLES',
  MISSING_VIEWPORT_DIMENSIONS = 'MISSING_VIEWPORT_DIMENSIONS',
  NODE_INVALID = 'NODE_INVALID',
  NODE_NOT_FOUND = 'NODE_NOT_FOUND',
  NODE_MISSING_PARENT = 'NODE_MISSING_PARENT',
  NODE_TYPE_MISSING = 'NODE_TYPE_MISSING',
  NODE_EXTENT_INVALID = 'NODE_EXTENT_INVALID',
  EDGE_INVALID = 'EDGE_INVALID',
  EDGE_NOT_FOUND = 'EDGE_NOT_FOUND',
  EDGE_SOURCE_MISSING = 'EDGE_SOURCE_MISSING',
  EDGE_TARGET_MISSING = 'EDGE_TARGET_MISSING',
  EDGE_TYPE_MISSING = 'EDGE_TYPE_MISSING',
  EDGE_SOURCE_TARGET_MISSING = 'EDGE_SOURCE_TARGET_MISSING',

  USE_VUE_FLOW_OUTSIDE_PROVIDER = 'USE_VUE_FLOW_OUTSIDE_PROVIDER',
}

const messages = {
  [ErrorCode.MISSING_STYLES]: () =>
    `It seems that you haven't loaded the necessary styles. Please import '@vue-flow/core/dist/style.css' to ensure that the graph is rendered correctly`,
  [ErrorCode.MISSING_VIEWPORT_DIMENSIONS]: () => 'The Vue Flow parent container needs a width and a height to render the graph',
  [ErrorCode.NODE_INVALID]: (id?: string) => `Node is invalid\nNode id: ${id}`,
  [ErrorCode.NODE_NOT_FOUND]: (id: string | null) => `Node not found\nNode id: ${id}`,
  [ErrorCode.NODE_MISSING_PARENT]: (id: string, parentId: string) =>
    `Node is missing a parent\nNode id: ${id}\nParent id: ${parentId}`,
  [ErrorCode.NODE_TYPE_MISSING]: (type: string) => `Node type is missing\nType: ${type}`,
  [ErrorCode.NODE_EXTENT_INVALID]: (id: string) => `Only child nodes can use a parent extent\nNode id: ${id}`,
  [ErrorCode.EDGE_INVALID]: (id: string) => `An edge needs a source and a target\nEdge id: ${id}`,
  [ErrorCode.EDGE_SOURCE_MISSING]: (id: string, source: string) =>
    `Edge source is missing\nEdge id: ${id} \nSource id: ${source}`,
  [ErrorCode.EDGE_TARGET_MISSING]: (id: string, target: string) =>
    `Edge target is missing\nEdge id: ${id} \nTarget id: ${target}`,
  [ErrorCode.EDGE_TYPE_MISSING]: (type: string) => `Edge type is missing\nType: ${type}`,
  [ErrorCode.EDGE_SOURCE_TARGET_MISSING]: (id: string, source: string, target: string) =>
    `Edge source or target is missing\nEdge id: ${id} \nSource id: ${source} \nTarget id: ${target}`,
  [ErrorCode.EDGE_NOT_FOUND]: (id: string) => `Edge not found\nEdge id: ${id}`,
  [ErrorCode.USE_VUE_FLOW_OUTSIDE_PROVIDER]: () =>
    `useVueFlow() was called without a <VueFlow> or <VueFlowProvider> ancestor (or outside a component setup). Render one of them above the call, or wrap your components in <VueFlowProvider> to share a store.`,
} as const;

type ErrorArgs<T extends ErrorCode> = (typeof messages)[T] extends (...args: any[]) => string
  ? Parameters<(typeof messages)[T]>
  : never;

export class VueFlowError<T extends ErrorCode = ErrorCode, Args extends ErrorArgs<T> = ErrorArgs<T>> extends Error {
  name = 'VueFlowError';
  code: T;
  args: Args;

  constructor(code: T, ...args: Args) {
    // @ts-expect-error - TS doesn't know that the message is a key of messages
    super(messages[code]?.(...args));
    this.code = code;
    this.args = args;
  }
}

export function isErrorOfType<T extends ErrorCode>(error: VueFlowError, code: T): error is VueFlowError<T> {
  return error.code === code;
}
