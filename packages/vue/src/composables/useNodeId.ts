import { inject } from 'vue';
import { NodeId } from '../context';

/**
 * This composable returns the current node id from the ctx.
 *
 * It should be used inside a (custom-)node components ctx as the id is provided by the internal `NodeWrapper` component.
 *
 * @public
 * @returns the current node id
 */
export function useNodeId() {
  return inject(NodeId, '');
}
