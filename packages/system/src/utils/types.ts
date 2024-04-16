import { Rect } from '../types';

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type ParentExpandChild = { id: string; parentId: string; rect: Rect };
