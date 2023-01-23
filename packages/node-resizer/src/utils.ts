type GetDirectionParams = {
  width: number;
  prevWidth: number;
  height: number;
  prevHeight: number;
  invertX: boolean;
  invertY: boolean;
};

// returns an array of two numbers (0, 1 or -1) representing the direction of the resize
// 0 = no change, 1 = increase, -1 = decrease
export function getDirection({ width, prevWidth, height, prevHeight, invertX, invertY }: GetDirectionParams) {
  const deltaWidth = width - prevWidth;
  const deltaHeight = height - prevHeight;

  const direction = [deltaWidth > 0 ? 1 : deltaWidth < 0 ? -1 : 0, deltaHeight > 0 ? 1 : deltaHeight < 0 ? -1 : 0];

  if (deltaWidth && invertX) {
    direction[0] = direction[0] * -1;
  }

  if (deltaHeight && invertY) {
    direction[1] = direction[1] * -1;
  }
  return direction;
}
