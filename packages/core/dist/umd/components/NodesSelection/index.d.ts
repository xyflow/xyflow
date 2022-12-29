/**
 * The nodes selection rectangle gets displayed when a user
 * made a selection with on or several nodes
 */
import type { MouseEvent } from 'react';
import type { Node } from '../../types';
export interface NodesSelectionProps {
    onSelectionContextMenu?: (event: MouseEvent, nodes: Node[]) => void;
    noPanClassName?: string;
    disableKeyboardA11y: boolean;
}
declare function NodesSelection({ onSelectionContextMenu, noPanClassName, disableKeyboardA11y }: NodesSelectionProps): JSX.Element | null;
declare const _default: import("react").MemoExoticComponent<typeof NodesSelection>;
export default _default;
//# sourceMappingURL=index.d.ts.map