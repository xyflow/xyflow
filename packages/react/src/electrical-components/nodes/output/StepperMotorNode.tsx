import { memo, useState } from 'react';
import { Handle, Position, NodeProps, BuiltInNode } from '@xyflow/react';

const mmToPix = 3.7795275591;

interface NEMASpec {
  id: number;
  frameSize: number;
  holeRadius: number;
  shaftRadius: number;
  cornerRadius: number;
  cornerOffset: number;
  bodyRadius: number;
  textSize: number;
  valueYPosition: number;
  unitsYPosition: number;
}

const defaultSize = 23;

const StepperMotorNode = ({ id, data }: NodeProps<BuiltInNode>) => {
  const [angle] = useState((data?.angle as number) || 0);
  const [arrow] = useState((data?.arrow as string) || '');
  const [value] = useState((data?.value as string) || '');
  const [units] = useState((data?.units as string) || '');
  const [size] = useState((data?.size as 8 | 11 | 14 | 17 | 23 | 34) || defaultSize);

  const nemaSpecMap: { [key: string]: NEMASpec } = {
    '8': {
      id: 8,
      frameSize: 20.4,
      holeRadius: 0.5,
      shaftRadius: 3.5,
      cornerRadius: 2.5,
      cornerOffset: 2.5,
      bodyRadius: 7.7,
      textSize: 10,
      valueYPosition: 16.5,
      unitsYPosition: 19.7,
    },
    '11': {
      id: 11,
      frameSize: 28.2,
      holeRadius: 1.25,
      shaftRadius: 5,
      cornerRadius: 2.5,
      cornerOffset: 2.5,
      bodyRadius: 11,
      textSize: 12,
      valueYPosition: 21.5,
      unitsYPosition: 24,
    },
    '14': {
      id: 14,
      frameSize: 35.2,
      holeRadius: 1.5,
      shaftRadius: 5,
      cornerRadius: 4.5,
      cornerOffset: 4.5,
      bodyRadius: 11,
      textSize: 14,
      valueYPosition: 26,
      unitsYPosition: 32,
    },
    '17': {
      id: 17,
      frameSize: 42.3,
      holeRadius: 1.5,
      shaftRadius: 5,
      cornerRadius: 5,
      cornerOffset: 5.5,
      bodyRadius: 14,
      textSize: 16,
      valueYPosition: 30.5,
      unitsYPosition: 33.7,
    },
    '23': {
      id: 23,
      frameSize: 57.3,
      holeRadius: 2.5,
      shaftRadius: 6.35,
      cornerRadius: 5,
      cornerOffset: 5.5,
      bodyRadius: 19.5,
      textSize: 24,
      valueYPosition: 41,
      unitsYPosition: 46,
    },
    '34': {
      id: 34,
      frameSize: 86,
      holeRadius: 3.25,
      shaftRadius: 14,
      cornerRadius: 3.25,
      cornerOffset: 8.4,
      bodyRadius: 36.5,
      textSize: 32,
      valueYPosition: 68,
      unitsYPosition: 75,
    },
  };

  const spec = nemaSpecMap[size] ?? nemaSpecMap[defaultSize];

  const xOff = (spec.frameSize / 2 - 3.75) * mmToPix + 1;
  const yOff = (spec.frameSize + 5) * mmToPix;

  const pinInfo = [
    { name: 'A-', y: yOff, x: xOff, number: 1, signals: [] },
    { name: 'A+', y: yOff, x: xOff + 2.54 * mmToPix, number: 2, signals: [] },
    { name: 'B+', y: yOff, x: xOff + 5.08 * mmToPix, number: 3, signals: [] },
    { name: 'B-', y: yOff, x: xOff + 7.62 * mmToPix, number: 4, signals: [] },
  ];

  const cornerRadius = spec.cornerRadius;
  const holeRadius = spec.holeRadius;
  const shaftRadius = spec.shaftRadius;
  const frameSize = spec.frameSize;
  const cornerOffset = spec.cornerOffset;
  const bodyRadius = spec.bodyRadius;

  const halfShaft = shaftRadius / 2;
  const halfFrame = frameSize / 2;

  const innerHoleRadius = holeRadius * 0.9;
  const outerHoleRadius = holeRadius * 1.1;

  const rOff = Math.sqrt(0.75 * Math.pow(shaftRadius, 2));

  return (
    <div
      style={{
        background: 'transparent',
        padding: 0,
        position: 'relative',
      }}
    >
      {/* Handles for pins */}
      {pinInfo.map((pin) => (
        <Handle
          key={`${id}-${pin.name}-source`}
          type="source"
          position={Position.Bottom}
          id={`${id}-${pin.name}-source`}
          style={{
            left: `${pin.x}px`,
            top: `${pin.y}px`,
            background: '#1a192b',
          }}
        />
      ))}
      {pinInfo.map((pin) => (
        <Handle
          key={`${id}-${pin.name}-target`}
          type="target"
          position={Position.Bottom}
          id={`${id}-${pin.name}-target`}
          style={{
            left: `${pin.x}px`,
            top: `${pin.y}px`,
            background: '#1a192b',
          }}
        />
      ))}

      <svg
        width={`${frameSize + 1}mm`}
        height={`${frameSize + 5}mm`}
        version="1.1"
        viewBox={`0 0 ${(1 + frameSize) * mmToPix} ${(5 + frameSize) * mmToPix}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <linearGradient
            id={`frame-gradient-${id}`}
            x1={-frameSize * 0.2}
            x2={frameSize * 2}
            y1={frameSize}
            y2={frameSize}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#666" offset="0" />
            <stop stopColor="#fff" offset="1" />
          </linearGradient>
          <linearGradient
            id={`shaft-gradient-${id}`}
            x1="0"
            x2="0"
            y1="-5"
            y2="5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9d9d9d" offset="0" />
            <stop stopColor="#9d9d9d" stopOpacity="0" offset="1" />
          </linearGradient>
          <linearGradient
            id={`body-gradient-${id}`}
            x1={frameSize * 0.1}
            x2={frameSize * 0.7}
            y1={frameSize}
            y2={frameSize}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9d9d9d" offset="0" />
            <stop stopColor="#fdfafa" offset=".29501" />
            <stop offset="1" stopColor="#2a2a2a" />
          </linearGradient>
        </defs>
        {/* Body */}
        <g transform="translate(1,1)">
          <g transform={`scale(${mmToPix})`}>
            {/* Pins */}
            <path
              id={`pin-${id}`}
              transform={`translate(${halfFrame - 3.75} ${frameSize})`}
              fill="#9f9f9f"
              d="m 0 0 c .5 0 .5 0 .5 .5 v 4.55 c -.5 .5 -.5 .5 -1 0 v -4.5 c 0 -.5 0 -.5 .5 -.5"
            />
            <use xlinkHref={`#pin-${id}`} x="2.54" />
            <use xlinkHref={`#pin-${id}`} x="5.08" />
            <use xlinkHref={`#pin-${id}`} x="7.62" />

            <g strokeLinecap="round" strokeLinejoin="round">
              <rect
                width={frameSize}
                height={frameSize}
                rx={cornerRadius}
                ry={cornerRadius}
                fill={`url(#frame-gradient-${id})`}
                stroke="#000"
                strokeWidth=".3245"
              />
              <circle cx={cornerOffset} cy={cornerOffset} r={outerHoleRadius} fill="#666" />
              <circle cx={cornerOffset} cy={cornerOffset} r={innerHoleRadius} fill="#e6e6e6" />
              <circle
                cx={frameSize - cornerOffset}
                cy={cornerOffset}
                r={outerHoleRadius}
                fill="#666"
              />
              <circle
                cx={frameSize - cornerOffset}
                cy={cornerOffset}
                r={innerHoleRadius}
                fill="#e6e6e6"
              />
              <circle
                cx={cornerOffset}
                cy={frameSize - cornerOffset}
                r={outerHoleRadius}
                fill="#666"
              />
              <circle
                cx={cornerOffset}
                cy={frameSize - cornerOffset}
                r={innerHoleRadius}
                fill="#e6e6e6"
              />
              <circle
                cx={frameSize - cornerOffset}
                cy={frameSize - cornerOffset}
                r={outerHoleRadius}
                fill="#666"
              />
              <circle
                cx={frameSize - cornerOffset}
                cy={frameSize - cornerOffset}
                r={innerHoleRadius}
                fill="#e6e6e6"
              />
            </g>

            {/* motor body */}
            <circle
              cx={halfFrame}
              cy={halfFrame}
              r={bodyRadius}
              fill="#868686"
              fillOpacity=".89602"
              opacity=".73"
              stroke={`url(#body-gradient-${id})`}
              strokeWidth="1.41429"
            />
            {/* Rotator */}
            <g>
              <path
                transform={`rotate(${angle}, ${halfFrame},${halfFrame}) translate(${halfFrame} ${halfFrame})`}
                fill={arrow || 'transparent'}
                d={`m 0 0 l -${shaftRadius} 0 l ${shaftRadius} -${halfFrame - 3} l ${shaftRadius} ${halfFrame - 3} z`}
              />
              <path
                transform={`translate(${halfFrame}, ${halfFrame}) rotate(${angle}) translate(0, 0)`}
                d={`m -${halfShaft} -${rOff} a ${shaftRadius} ${shaftRadius} 0 1 0 ${shaftRadius} 0 z`}
                fill="#4d4d4d"
                stroke={`url(#shaft-gradient-${id})`}
                strokeWidth=".57968"
              />
            </g>

            {/* Text */}
            <text fontFamily="arial" fontSize="14.667px" textAlign="center" textAnchor="middle">
              <tspan x={halfFrame} y={spec.valueYPosition} fontSize={`${spec.textSize / mmToPix}px`}>
                {value}
              </tspan>
              <tspan
                x={halfFrame}
                y={spec.unitsYPosition}
                fontSize={`${(0.7 * spec.textSize) / mmToPix}px`}
              >
                {units}
              </tspan>
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default memo(StepperMotorNode);
