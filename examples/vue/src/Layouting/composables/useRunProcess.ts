import type { graphlib } from '@dagrejs/dagre';
import type { Node } from '@xyflow/vue';
import type { MaybeRefOrGetter } from 'vue';
import type { ProcessEdge } from '../edges';
import type { ProcessData, ProcessNode } from '../nodes';
import { useVueFlow } from '@xyflow/vue';
import { ref, toRef, toValue } from 'vue';
import { ProcessStatus } from '../nodes';

interface UseRunProcessOptions {
  graph: MaybeRefOrGetter<graphlib.Graph>;
  cancelOnError?: MaybeRefOrGetter<boolean>;
}

/**
 * Composable to simulate running a process tree.
 *
 * It loops through each node, pretends to run an async process, and updates the node's data indicating whether the process has finished.
 * When one node finishes, the next one starts.
 *
 * When a node has multiple descendants, it will run them in parallel.
 *
 * @param options
 * @param options.graph The graph object containing the nodes and edges.
 * @param options.cancelOnError Whether to cancel the process if an error occurs.
 */
export function useRunProcess({ graph: dagreGraph, cancelOnError = true }: UseRunProcessOptions) {
  const { updateNodeData, getConnectedEdges, getNode, getEdge } = useVueFlow<ProcessNode, ProcessEdge>();

  const graph = toRef(() => toValue(dagreGraph));

  const isRunning = ref(false);

  const runningTasks = new Map<string, ReturnType<typeof setTimeout>>();

  const executedNodes = new Set<string>();

  const upcomingTasks = new Set<string>();

  /**
   * Run the process on a node.
   * It will mark the node as running, simulate an async process, and then mark the node as finished or errored.
   *
   * @param nodeId The ID of the node to run.
   * @param isStart Whether this is a starting node.
   */
  async function runNode(nodeId: string, isStart = false) {
    if (executedNodes.has(nodeId)) {
      return;
    }

    // save the upcoming task in case it gets cancelled before we even start it
    upcomingTasks.add(nodeId);

    // get all incoming edges to this node
    const node = getNode(nodeId);
    const connectedEdges = node ? (getConnectedEdges([node as Node]) as ProcessEdge[]) : [];
    const incomers = connectedEdges.filter(connection => connection.target === nodeId);

    // wait for edge animations to finish before starting the process
    // re-read the edge from the store on every poll - edge updates replace the stored object, so a captured reference would go stale
    await Promise.all(incomers.map(incomer => until(() => !getEdge(incomer.id)?.data?.isAnimating)));

    // remove the upcoming task since we are about to start it
    upcomingTasks.clear();

    if (!isRunning.value) {
      // The process was stopped
      return;
    }

    // mark the node as executed, so it doesn't run again
    executedNodes.add(nodeId);

    updateNodeStatus(nodeId, ProcessStatus.RUNNING);

    // simulate an async process with a random timeout between 1-2 seconds
    const delay = Math.floor(Math.random() * 2000) + 1000;

    return new Promise((resolve) => {
      const timeout = setTimeout(
        async () => {
          // get all children of this node
          const children = graph.value.successors(nodeId) || [];

          // randomly decide whether the node will throw an error
          const willThrowError = Math.random() < 0.15;

          // we avoid throwing an error on the starting node
          if (!isStart && willThrowError) {
            updateNodeStatus(nodeId, ProcessStatus.ERROR);

            // if cancelOnError is true, we stop the process and mark all descendants as skipped
            if (toValue(cancelOnError)) {
              await skipDescendants(nodeId);
              runningTasks.delete(nodeId);

              resolve(true);
              return;
            }
          }

          updateNodeStatus(nodeId, ProcessStatus.FINISHED);

          runningTasks.delete(nodeId);

          if (children.length > 0) {
            // run the process on the children in parallel
            await Promise.all(children.map(child => runNode(child)));
          }

          resolve(true);
        },
        // if this is a starting node, we don't want to wait
        isStart ? 0 : delay,
      );

      // save the timeout so we can cancel it if needed
      runningTasks.set(nodeId, timeout);
    });
  }

  /**
   * Run a sequence of nodes.
   * It will start with the nodes that have no predecessors and then run the process on each node in sequence.
   * If a node has multiple descendants, it will run them in parallel.
   * If an error occurs, it will stop the process and mark all descendants as skipped.
   * If cancelOnError is true, it will stop the process if an error occurs.
   * If the process is stopped, it will mark all running nodes as cancelled.
   *
   * @param nodes The nodes to run.
   */
  async function run(nodes: ProcessNode[]) {
    // if the process is already running, we don't want to start it again
    if (isRunning.value) {
      return;
    }

    // reset all nodes to their initial state
    reset(nodes);

    isRunning.value = true;

    // get all starting nodes (nodes with no predecessors)
    const startingNodes = nodes.filter(node => graph.value.predecessors(node.id)?.length === 0);

    // run the process on all starting nodes in parallel
    await Promise.all(startingNodes.map(node => runNode(node.id, true)));

    clear();
  }

  /**
   * Reset all nodes to their initial state.
   *
   * @param nodes The nodes to reset.
   */
  function reset(nodes: ProcessNode[]) {
    clear();

    for (const node of nodes) {
      updateNodeStatus(node.id, null);
    }
  }

  /**
   * Skip all descendants of a node.
   *
   * @param nodeId The ID of the node to skip descendants for.
   */
  async function skipDescendants(nodeId: string) {
    const children = graph.value.successors(nodeId) || [];

    for (const child of children) {
      updateNodeStatus(child, ProcessStatus.SKIPPED);
      await skipDescendants(child);
    }
  }

  /**
   * Stop the process.
   *
   * It will mark all running nodes as cancelled and skip all upcoming tasks.
   */
  async function stop() {
    isRunning.value = false;

    for (const nodeId of upcomingTasks) {
      clearTimeout(runningTasks.get(nodeId));
      runningTasks.delete(nodeId);
      updateNodeStatus(nodeId, ProcessStatus.CANCELLED);
      await skipDescendants(nodeId);
    }

    for (const [nodeId, task] of runningTasks) {
      clearTimeout(task);
      runningTasks.delete(nodeId);
      updateNodeStatus(nodeId, ProcessStatus.CANCELLED);
      await skipDescendants(nodeId);
    }

    executedNodes.clear();
    upcomingTasks.clear();
  }

  /**
   * Clear all running tasks and executed nodes.
   */
  function clear() {
    isRunning.value = false;
    executedNodes.clear();
    runningTasks.clear();
  }

  /**
   * Update the status of a node.
   *
   * @param nodeId The ID of the node to update.
   * @param status The new status of the node.
   */
  function updateNodeStatus(nodeId: string, status: ProcessData['status']) {
    updateNodeData(nodeId, { status });
  }

  return { run, stop, reset, isRunning };
}

async function until(condition: () => boolean) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (condition()) {
        clearInterval(interval);
        resolve(true);
      }
    }, 100);
  });
}
