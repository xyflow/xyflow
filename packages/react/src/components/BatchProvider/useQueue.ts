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
  // Because we're using a ref above, we need some way to let React know when to
  // actually process the queue. We flip this bit of state to `true` any time we
  // mutate the queue and then flip it back to `false` after flushing the queue.
  const [shouldFlush, setShouldFlush] = useState(false);

  // A reference of all the batched updates to process before the next render. We
  // want a reference here so multiple synchronous calls to `setNodes` etc can be
  // batched together.
  const [queue] = useState(() => createQueue<T>(() => setShouldFlush(true)));

  // Layout effects are guaranteed to run before the next render which means we
  // shouldn't run into any issues with stale state or weird issues that come from
  // rendering things one frame later than expected (we used to use `setTimeout`).
  useIsomorphicLayoutEffect(() => {
    // Because we need to flip the state back to false after flushing, this should
    // trigger the hook again (!). If the hook is being run again we know that any
    // updates should have been processed by now and we can safely clear the queue
    // and bail early.
    if (!shouldFlush) {
      queue.reset();
      return;
    }

    const queueItems = queue.get();

    if (queueItems.length) {
      runQueue(queueItems);

      queue.reset();
    }

    // Beacuse we're using reactive state to trigger this effect, we need to flip
    // it back to false.
    setShouldFlush(false);
  }, [shouldFlush]);

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
