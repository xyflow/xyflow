import { CSSProperties } from 'react';
import type { ConnectionLineComponent, HandleType } from '../../types';
import { ConnectionLineType } from '../../types';
declare type ConnectionLineProps = {
    connectionNodeId: string;
    connectionHandleType: HandleType;
    connectionLineType: ConnectionLineType;
    isConnectable: boolean;
    connectionLineStyle?: CSSProperties;
    CustomConnectionLineComponent?: ConnectionLineComponent;
};
declare const ConnectionLine: {
    ({ connectionNodeId, connectionHandleType, connectionLineStyle, connectionLineType, isConnectable, CustomConnectionLineComponent, }: ConnectionLineProps): JSX.Element | null;
    displayName: string;
};
export default ConnectionLine;
//# sourceMappingURL=index.d.ts.map