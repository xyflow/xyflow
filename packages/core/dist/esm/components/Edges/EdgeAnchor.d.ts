import type { FC, MouseEvent as ReactMouseEvent, SVGAttributes } from 'react';
import { Position } from '../../types';
export interface EdgeAnchorProps extends SVGAttributes<SVGGElement> {
    position: Position;
    centerX: number;
    centerY: number;
    radius?: number;
    onMouseDown: (event: ReactMouseEvent<SVGGElement, MouseEvent>) => void;
    onMouseEnter: (event: ReactMouseEvent<SVGGElement, MouseEvent>) => void;
    onMouseOut: (event: ReactMouseEvent<SVGGElement, MouseEvent>) => void;
    type: string;
}
export declare const EdgeAnchor: FC<EdgeAnchorProps>;
//# sourceMappingURL=EdgeAnchor.d.ts.map