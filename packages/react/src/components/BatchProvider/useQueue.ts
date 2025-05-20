import { useState } from 'react';

import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import { Queue, QueueItem } from './types';

/**
 * This hook returns a queue that can be used to batch updates.
 *
 * @param runQueue - a function that gets called when the queue is flushed
 * @internal
 *
 * @returns a Queue object
 */
export function useQueue<T>(runQueue: (items: QueueItem<T>[]) => void) {
  /*
   * Because we're using a ref above, we need some way to let React know when to
   * actually process the queue. We increment this number any time we mutate the
   * queue, creating a new state to trigger the layout effect below.
   * Using a boolean dirty flag here instead would lead to issues related to
   * automatic batching. (https://github.com/xyflow/xyflow/issues/4779)
   */
  const [serial, setSerial] = useState(BigInt(0));

  /*
   * A reference of all the batched updates to process before the next render. We
   * want a reference here so multiple synchronous calls to `setNodes` etc can be
   * batched together.
   */
  const [queue] = useState(() => createQueue<T>(() => setSerial(n => n + BigInt(1))));

  /*
   * Layout effects are guaranteed to run before the next render which means we
   * shouldn't run into any issues with stale state or weird issues that come from
   * rendering things one frame later than expected (we used to use `setTimeout`).
   */
  useIsomorphicLayoutEffect(() => {
    const queueItems = queue.get();

    if (queueItems.length) {
      runQueue(queueItems);

      queue.reset();
    }
  }, [serial]);

  return queue;
}

function createQueue<T>(cb: () => void): Queue<T> {
  let queue: QueueItem<T>[] = [];

  return {
    get: () => queue,
    reset: () => {
      queue = [];
    },
    push: (item) => {
      queue.push(item);
      cb();
    },
  };
}
