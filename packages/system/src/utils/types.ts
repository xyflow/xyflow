import { Rect } from '../types';

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type PartialOrUndefined<T> = {
  [K in keyof T]?: T[K] | undefined;
};

/** Allow explicitly undefined optional values while preserving required properties. */
export type OptionalOrUndefined<T> = {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Check whether the property can be omitted.
  [K in keyof T]: {} extends Pick<T, K> ? T[K] | undefined : T[K];
};

export type ParentExpandChild = { id: string; parentId: string; rect: Rect };
