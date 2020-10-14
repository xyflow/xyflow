export const createGridLinesPath = (scaledGap: number, strokeWidth: number, stroke: string): string => {
  const halfGap = scaledGap / 2;
  return `<path stroke="${stroke}" strokeWidth="${strokeWidth}" d="M${halfGap} 0 V${scaledGap} M0 ${halfGap} H${scaledGap}" />`;
};

export const createGridDotsPath = (scaledGap: number, size: number, fill: string): string => {
  const halfGap = scaledGap / 2;
  return `<circle cx="${halfGap}" cy="${halfGap}" r="${size}" fill="${fill}" />`;
};
