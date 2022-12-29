import { MouseEvent } from 'react';
import { StoreApi } from 'zustand';
import type { HandleElement, Node, NodeOrigin, ReactFlowState } from '../../types';
export declare const getHandleBounds: (selector: string, nodeElement: HTMLDivElement, zoom: number, nodeOrigin: NodeOrigin) => HandleElement[] | null;
export declare function getMouseHandler(id: string, getState: StoreApi<ReactFlowState>['getState'], handler?: (event: MouseEvent, node: Node) => void): ((event: MouseEvent) => void) | undefined;
export declare function handleNodeClick({ id, store, unselect, }: {
    id: string;
    store: {
        getState: StoreApi<ReactFlowState>['getState'];
        setState: StoreApi<ReactFlowState>['setState'];
    };
    unselect?: boolean;
}): void;
//# sourceMappingURL=utils.d.ts.map