import React, { SVGAttributes } from 'react';
interface EdgeRendererProps {
    width: number;
    height: number;
    edgeTypes: any;
    connectionLineStyle?: SVGAttributes<{}>;
    connectionLineType?: string;
    onElementClick?: () => void;
}
declare const EdgeRenderer: React.MemoExoticComponent<(props: EdgeRendererProps) => JSX.Element | null>;
export default EdgeRenderer;
