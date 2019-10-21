import React from 'react';
import { HandleType, Position, OnConnectFunc } from '../../types';
interface HandleProps {
    type: HandleType;
    position: Position;
    onConnect?: OnConnectFunc;
    isValidConnection?: () => boolean;
}
declare const Handle: React.MemoExoticComponent<({ onConnect, type, position, isValidConnection, ...rest }: HandleProps) => JSX.Element>;
export default Handle;
