export function createAction<T extends string>(type: T): { type: T };
export function createAction<T extends string, P extends any>(type: T, payload: P): { type: T; payload: P };
export function createAction(type: string, payload?: any) {
  return { type, payload };
}
