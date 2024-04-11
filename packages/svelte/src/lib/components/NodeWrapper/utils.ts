export function getNodeInlineStyleDimensions({
  width,
  height,
  initialWidth,
  initialHeight,
  measuredWidth,
  measuredHeight
}: {
  width?: number;
  height?: number;
  initialWidth?: number;
  initialHeight?: number;
  measuredWidth?: number;
  measuredHeight?: number;
}): {
  width: string | undefined;
  height: string | undefined;
} {
  if (measuredWidth === undefined && measuredHeight === undefined) {
    const styleWidth = width ?? initialWidth;
    const styleHeight = height ?? initialHeight;

    return {
      width: styleWidth ? `width:${styleWidth}px;` : '',
      height: styleHeight ? `height:${styleHeight}px;` : ''
    };
  }

  return {
    width: width ? `width:${width}px;` : '',
    height: height ? `height:${height}px;` : ''
  };
}
