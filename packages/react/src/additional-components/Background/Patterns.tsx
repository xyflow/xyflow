type LinePatternProps = {
  dimensions: [number, number];
  lineWidth?: number;
  color: string;
};

export function LinePattern({
  color,
  dimensions,
  lineWidth,
}: LinePatternProps) {
  return (
    <path
      stroke={color}
      strokeWidth={lineWidth}
      d={`M${dimensions[0] / 2} 0 V${dimensions[1]} M0 ${dimensions[1] / 2} H${
        dimensions[0]
      }`}
    />
  );
}

type DotPatternProps = {
  radius: number;
  color: string;
};

export function DotPattern({ color, radius }: DotPatternProps) {
  return <circle cx={radius} cy={radius} r={radius} fill={color} />;
}
