import type { MouseEvent as ReactMouseEvent } from 'react';
import { StoreApi } from 'zustand';
import { ConnectionMode } from '../../types';
import type { OnConnect, Connection, HandleType, ReactFlowState } from '../../types';
declare type ValidConnectionFunc = (connection: Connection) => boolean;
declare type Result = {
    elementBelow: Element | null;
    isValid: boolean;
    connection: Connection;
    isHoveringHandle: boolean;
};
export declare function checkElementBelowIsValid(event: MouseEvent, connectionMode: ConnectionMode, isTarget: boolean, nodeId: string, handleId: string | null, isValidConnection: ValidConnectionFunc, doc: Document | ShadowRoot): Result;
export declare function handleMouseDown({ event, handleId, nodeId, onConnect, isTarget, getState, setState, isValidConnection, elementEdgeUpdaterType, onEdgeUpdateEnd, }: {
    event: ReactMouseEvent;
    handleId: string | null;
    nodeId: string;
    onConnect: OnConnect;
    isTarget: boolean;
    getState: StoreApi<ReactFlowState>['getState'];
    setState: StoreApi<ReactFlowState>['setState'];
    isValidConnection: ValidConnectionFunc;
    elementEdgeUpdaterType?: HandleType;
    onEdgeUpdateEnd?: (evt: MouseEvent) => void;
}): void;
export {};
//# sourceMappingURL=handler.d.ts.map