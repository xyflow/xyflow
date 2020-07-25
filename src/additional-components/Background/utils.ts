export const createGridLinesPath = (xOffset: number, yOffset: number, scaledGap: number): string => {
  const x = xOffset < 0 ? scaledGap + xOffset : xOffset;
  const y = yOffset < 0 ? scaledGap + yOffset : yOffset;

  return `M${x} 0 V${scaledGap} M0 ${y} H${scaledGap}`;
};

export const createGridDotsPath = (xOffset: number, yOffset: number, scaledGap: number, size: number): string => {
  const x = xOffset < 0 ? scaledGap + xOffset : xOffset;
  const y = yOffset < 0 ? scaledGap + yOffset : yOffset;

  return `M${x} ${y - size} l${size} ${size} l${-size} ${size} l${-size} ${-size}z`;
};
