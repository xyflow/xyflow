export type QueueItem<T> = T[] | ((items: T[]) => T[]);

export type Queue<T> = {
  get: () => QueueItem<T>[];
  reset: () => void;
  push: (item: QueueItem<T>) => void;
};
