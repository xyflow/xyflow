import React from 'react';
import { HandleType, ElementId, Position, XYPosition, OnConnectFunc, Connection } from '../../types';
declare type ValidConnectionFunc = (connection: Connection) => boolean;
declare type SetSourceIdFunc = (nodeId: ElementId | null) => void;
interface BaseHandleProps {
    type: HandleType;
    nodeId: ElementId;
    onConnect: OnConnectFunc;
    position: Position;
    setSourceId: SetSourceIdFunc;
    setPosition: (pos: XYPosition) => void;
    isValidConnection: ValidConnectionFunc;
    id?: ElementId | boolean;
    className?: string;
}
declare const BaseHandle: React.MemoExoticComponent<({ type, nodeId, onConnect, position, setSourceId, setPosition, className, id, isValidConnection, ...rest }: BaseHandleProps) => JSX.Element>;
export default BaseHandle;
