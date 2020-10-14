export const createGridLinesPath = (scaledGap: number, strokeWidth: number, stroke: string): string => {
  return `
    <path 
      stroke="${stroke}" strokeWidth="${strokeWidth}" 
      d="M${scaledGap / 2} 0 V${scaledGap} M0 ${scaledGap / 2} H${scaledGap}" 
    />`;
};

export const createGridDotsPath = (scaledGap: number, size: number, fill: string): string => {
  return `<circle cx="${scaledGap / 2}" cy="${scaledGap / 2}" r="${size}" fill="${fill}" />`;
};
