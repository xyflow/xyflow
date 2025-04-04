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
  width: number | undefined;
  height: number | undefined;
} {
  if (measuredWidth === undefined && measuredHeight === undefined) {
    const styleWidth = width ?? initialWidth;
    const styleHeight = height ?? initialHeight;

    return {
      width: styleWidth,
      height: styleHeight
    };
  }

  return {
    width: width,
    height: height
  };
}
