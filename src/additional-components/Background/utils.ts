export const createGridLinesPath = (
  width: number,
  height: number,
  xOffset: number,
  yOffset: number,
  gap: number
): string => {
  const lineCountX = Math.ceil(width / gap) + 1;
  const lineCountY = Math.ceil(height / gap) + 1;

  const xValues = Array.from({ length: lineCountX }, (_, i) => `M${i * gap + xOffset} 0 V${height}`);
  const yValues = Array.from({ length: lineCountY }, (_, i) => `M0 ${i * gap + yOffset} H${width}`);

  return [...xValues, ...yValues].join(' ');
};

export const createGridDotsPath = (
  width: number,
  height: number,
  xOffset: number,
  yOffset: number,
  gap: number,
  size: number
): string => {
  const lineCountX = Math.ceil(width / gap) + 1;
  const lineCountY = Math.ceil(height / gap) + 1;

  const values = Array.from({ length: lineCountX }, (_, col) => {
    const x = col * gap + xOffset;
    return Array.from({ length: lineCountY }, (_, row) => {
      const y = row * gap + yOffset;
      return `M${x} ${y - size} l${size} ${size} l${-size} ${size} l${-size} ${-size}z`;
    }).join(' ');
  });

  return values.join(' ');
};
