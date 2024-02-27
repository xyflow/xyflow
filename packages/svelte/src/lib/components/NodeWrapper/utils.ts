export function getNodeInlineStyleDimensions({
  width,
  height,
  initialWidth,
  initialHeight,
  computedWidth,
  computedHeight
}: {
  width?: number;
  height?: number;
  initialWidth?: number;
  initialHeight?: number;
  computedWidth?: number;
  computedHeight?: number;
}): {
  width: string | undefined;
  height: string | undefined;
} {
  if (computedWidth === undefined && computedHeight === undefined) {
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
