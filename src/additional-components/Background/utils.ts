export const createGridLinesPath = (scaledGap: number, strokeWidth: number, stroke: string): string => {
  return `<path stroke="${stroke}" strokeWidth="${strokeWidth}" d="M0 0 V${scaledGap} M0 0 H${scaledGap}" />`;
};

export const createGridDotsPath = (size: number, fill: string): string => {
  return `<circle cx="${size}" cy="${size}" r="${size}" fill="${fill}" />`;
};
