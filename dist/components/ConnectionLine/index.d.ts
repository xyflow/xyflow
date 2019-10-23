import { SVGAttributes } from 'react';
import { ElementId, Node, Transform } from '../../types';
interface ConnectionLineProps {
    connectionSourceId: ElementId;
    connectionPositionX: number;
    connectionPositionY: number;
    connectionLineType?: string | null;
    nodes: Node[];
    transform: Transform;
    isInteractive: boolean;
    connectionLineStyle?: SVGAttributes<{}>;
    className?: string;
}
declare const _default: ({ connectionSourceId, connectionLineStyle, connectionPositionX, connectionPositionY, connectionLineType, nodes, className, transform, isInteractive, }: ConnectionLineProps) => JSX.Element | null;
export default _default;
