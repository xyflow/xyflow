import type { XYPosition, Position, Dimensions, OnConnect, Connection } from '.';
export declare type HandleType = 'source' | 'target';
export interface HandleElement extends XYPosition, Dimensions {
    id?: string | null;
    position: Position;
}
export interface StartHandle {
    nodeId: string;
    type: HandleType;
    handleId?: string | null;
}
export interface HandleProps {
    type: HandleType;
    position: Position;
    isConnectable?: boolean;
    onConnect?: OnConnect;
    isValidConnection?: (connection: Connection) => boolean;
    id?: string;
}
//# sourceMappingURL=handles.d.ts.map