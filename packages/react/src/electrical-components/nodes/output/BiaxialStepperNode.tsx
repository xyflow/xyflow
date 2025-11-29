import { Position, Handle, NodeProps, BuiltInNode } from '@xyflow/react';
import { useState } from 'react';

type HandShape = 'arrow' | 'plain' | 'ornate';

export type BiaxialStepperNodeData = {
  label?: string;
  outerHandLength?: number;
  outerHandAngle?: number;
  outerHandColor?: string;
  outerHandShape?: HandShape;
  innerHandLength?: number;
  innerHandAngle?: number;
  innerHandColor?: string;
  innerHandShape?: HandShape;
  [key: string]: unknown;
};

const SHAFT_X = 60;
const SHAFT_Y = 77;
const OUTER_OFFSET = 9;
const INNER_OFFSET = 4.7;
const ORNATE_OUTER_OFFSET = 9;
const ORNATE_INNER_OFFSET = 5;
const mmToPix = 3.7795275591;

export default function BiaxialStepperNode({ data, isConnectable }: NodeProps<BuiltInNode>) {
  const nodeData = data as BiaxialStepperNodeData;

  const [outerHandAngle] = useState(nodeData.outerHandAngle || 0);
  const [innerHandAngle] = useState(nodeData.innerHandAngle || 0);

  const pinInfo = [
    { name: 'A1-', x: 45, y: (28.9 + 0 * 2.54) * mmToPix, number: 1, position: Position.Left },
    { name: 'A1+', x: 45, y: (28.9 + 1 * 2.54) * mmToPix, number: 2, position: Position.Left },
    { name: 'B1+', x: 45, y: (28.9 + 2 * 2.54) * mmToPix, number: 3, position: Position.Left },
    { name: 'B1-', x: 45, y: (28.9 + 3 * 2.54) * mmToPix, number: 4, position: Position.Left },
    { name: 'A2-', x: 45, y: (28.9 + 4 * 2.54) * mmToPix, number: 5, position: Position.Left },
    { name: 'A2+', x: 45, y: (28.9 + 5 * 2.54) * mmToPix, number: 6, position: Position.Left },
    { name: 'B2+', x: 45, y: (28.9 + 6 * 2.54) * mmToPix, number: 7, position: Position.Left },
    { name: 'B2-', x: 45, y: (28.9 + 7 * 2.54) * mmToPix, number: 8, position: Position.Left },
  ];

  const constrain = (v: number, min: number, max: number): number => {
    return Math.max(min, Math.min(v, max));
  };

  const getHandPath = (
    type: 'outer' | 'inner',
    shape: HandShape,
    len: number
  ): { xOff: number; yOff: number; path: string } => {
    const handPaths = {
      outerPlain: (len: number) => ({
        xOff: OUTER_OFFSET,
        yOff: OUTER_OFFSET,
        path: `m 0 0 c 0 5 4 9 9 9 c 3.3 0 6.1 -1.7 7.7 -4.3 h 24.9 h ${len} c 1.4 -1.5 1.9 -3.6 1.8 -4.7 c 0 -1.4 -0.4 -3.2 -1.9 -4.6 h -${len} h -24.8 c -1.6 -2.7 -4.5 -4.4 -7.8 -4.4 c -5 0 -9 4.1 -9 9 z m 3.5 0 c 0 -3 2.4 -5.4 5.5 -5.4 s 5.5 2.4 5.5 5.4 s -2.5 5.4 -5.5 5.4 s -5.5 -2.4 -5.5 -5.4 z`,
      }),
      innerPlain: (len: number) => ({
        xOff: INNER_OFFSET,
        yOff: INNER_OFFSET,
        path: `m 0 0 c 0 2.6 2.1 4.7 4.7 4.7 c 1.3 0 1.3 0 2.4 -0.4 h 2 h 27.7 h ${len} c 1.2 -1.2 1.8 -3.3 1.8 -4.3 c 0 -1 -0.7 -3.3 -1.9 -4.2 h -${len} h -27.7 h -1.9 c -0.2 0 -1.3 -0.5 -2.6 -0.5 c -2.6 0 -4.7 2.1 -4.7 4.7 z m 2.7 0 c 0 -1.1 0.9 -2 2 -2 s 2 0.9 2 2 s -0.9 2 -2 2 s -2 -0.9 -2 -2 z`,
      }),
    };

    const key = `${type}${shape.charAt(0).toUpperCase() + shape.slice(1)}` as keyof typeof handPaths;
    const pathFn = handPaths[key] || handPaths[`${type}Plain` as keyof typeof handPaths];
    return pathFn(len);
  };

  const outerHandLength = constrain(nodeData.outerHandLength || 30, 20, 70);
  const innerHandLength = constrain(nodeData.innerHandLength || 30, 20, 70);
  const outerHandColor = nodeData.outerHandColor || 'gold';
  const innerHandColor = nodeData.innerHandColor || 'silver';
  const outerHandShape = nodeData.outerHandShape || 'plain';
  const innerHandShape = nodeData.innerHandShape || 'plain';

  const outerPathDesc = getHandPath('outer', outerHandShape, outerHandLength);
  const innerPathDesc = getHandPath('inner', innerHandShape, innerHandLength);

  const x = SHAFT_X;
  const y = SHAFT_Y;

  return (
    <div style={{ position: 'relative' }}>
      {pinInfo.map((pin) => {
        const handleStyle = {
          position: 'absolute' as const,
          left: `${pin.x - 7}px`,
          top: `${pin.y}px`,
          width: '4px',
          height: '4px',
          background: '#1a192b',
          border: '1px solid white',
          cursor: 'crosshair',
        };

        return (
          <div key={pin.name}>
            <Handle
              type="source"
              position={pin.position}
              id={`${pin.name}-source`}
              isConnectable={isConnectable}
              style={handleStyle}
            />
            <Handle
              type="target"
              position={pin.position}
              id={`${pin.name}-target`}
              isConnectable={isConnectable}
              style={handleStyle}
            />
          </div>
        );
      })}

      <svg xmlns="http://www.w3.org/2000/svg" width="56mm" height="67.5mm" viewBox="0 0 212 255">
        <defs>
          <style>
            {`
              .cls-1 { fill: #939598; }
              .cls-2 { fill: #d2d2d2; }
              .cls-3 { fill: #808285; }
              .cls-4 { fill: #ed1f24; }
              .cls-5 { fill: #70bf44; }
              .cls-6 { fill: #414042; }
              .cls-h {
                stroke: #000;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-width: 0.1px;
              }
            `}
          </style>
          <linearGradient id="hole-gradient">
            <stop stopColor="#4f4f4f" offset="-25%" />
            <stop stopColor="grey" offset="75%" />
          </linearGradient>
        </defs>

        <g transform="translate(45 30)">
          {/* Pins */}
          <g transform={`scale(${mmToPix}) translate(2 20.5)`}>
            <path id="pin-1" className="cls-3" d="m 0 0 h -2 c -0.5 0.5 -0.5 0.5 0 1 h 2 z" />
            <use href="#pin-1" y="2.54" />
            <use href="#pin-1" y="5.08" />
            <use href="#pin-1" y="7.62" />
            <use href="#pin-1" y="10.16" />
            <use href="#pin-1" y="12.70" />
            <use href="#pin-1" y="15.24" />
            <use href="#pin-1" y="17.78" />
          </g>

          {/* Body */}
          <g>
            {/* Base */}
            <path
              className="cls-6"
              d="m 42.81 0 c -21.15 6.64 -37 25.23 -39.61 47.87 c -1.87 1.6 -3.08 3.95 -3.08 6.61 c 0 2.67 1.21 5.01 3.08 6.61 c 0.33 2.84 0.89 5.6 1.63 8.31 l 0 88.29 c -0.69 2.57 -1.23 5.2 -1.56 7.89 c -1.97 1.6 -3.27 4.01 -3.27 6.76 c 0 2.75 1.25 5.09 3.19 6.69 c 2.49 22.4 17.95 40.81 38.68 47.73 l 36.12 0 c 20.57 -6.87 35.96 -25.09 38.63 -47.27 c 2.08 -1.6 3.44 -4.08 3.44 -6.89 c 0 -2.81 -1.36 -5.31 -3.44 -6.89 c -0.35 -2.91 -0.93 -5.73 -1.71 -8.49 l 0 -87.35 c 0.77 -2.76 1.35 -5.59 1.71 -8.49 c 2.08 -1.6 3.44 -4.08 3.44 -6.89 c 0 -2.81 -1.36 -5.31 -3.44 -6.89 c -2.72 -22.52 -18.52 -40.96 -39.57 -47.59 l -34.23 0 z"
            />

            {/* Ribs */}
            <path
              className="cls-3"
              d="M 62.89 0.01 l -5.96 0 l 0 29.99 c -1.17 0.25 -2.26 0.67 -3.32 1.17 l -13.17 -16.82 c -1.008 -1.717 -2.824 -3.461 -4.943 -2.697 c -1.398 0.505 -1.946 1.096 -1.423 4.207 l 0.006 0.01 l 14.77 18.86 c -1.36 1.51 -2.4 3.27 -3.06 5.22 l -39.71 -4.28 c -0.67 1.89 -1.24 3.82 -1.69 5.8 l 40.6 4.37 c 0.06 1.19 0.28 2.33 0.61 3.43 l -40.79 22.6 l 0 6.81 l 18.6 -10.32 l 0 42.07 l -18.6 0 l 0 5.96 l 18.6 0 l 0 41.9 l -18.58 -10.36 l 0 6.82 l 40.81 22.72 c -0.36 1.13 -0.59 2.32 -0.67 3.54 l -40.64 4.56 c 0.46 1.98 1.03 3.91 1.7 5.8 l 39.7 -4.45 c 0.64 1.91 1.64 3.61 2.94 5.11 l -14.06 18.38 l 0.04 0.04 c -0.34 0.51 -0.58 1.1 -0.58 1.75 c 0 1.77 1.44 3.2 3.2 3.2 c 1.6 0 2.88 -1.2 3.1 -2.75 l 13 -17 c 1.12 0.56 2.3 1.03 3.56 1.3 l 0 29.53 l 5.96 0 l 0 -29.44 c 1.35 -0.24 2.63 -0.68 3.83 -1.27 l 13.25 16.92 c 0.24 1.52 1.51 2.71 3.11 2.71 c 1.77 0 3.2 -1.44 3.2 -3.2 c 0 -1.05 -0.53 -1.95 -1.32 -2.52 l 0.13 -0.11 l -13.6 -17.37 c 1.31 -1.47 2.34 -3.16 3 -5.04 l 39.34 4.24 c 0.66 -1.89 1.24 -3.83 1.69 -5.8 l -40.17 -4.33 c -0.07 -1.4 -0.34 -2.74 -0.76 -4.02 l 40.33 -22.37 l 0 -6.81 l -18.8 10.42 l 0 -90.26 l 18.8 10.46 l 0 -6.81 l -40.27 -22.41 c 0.34 -1.08 0.56 -2.22 0.66 -3.39 l 40.22 -4.51 c -0.45 -1.97 -1.04 -3.9 -1.69 -5.8 l -39.25 4.4 c -0.7 -2.12 -1.82 -4.05 -3.31 -5.65 l 13 -17.01 c 1.16 -0.48 1.99 -1.63 1.99 -2.96 c 0 -1.78 -1.44 -3.2 -3.2 -3.2 c -1.08 0 -1.99 0.57 -2.58 1.38 l -0.02 -0.02 l -14.02 18.33 c -1.12 -0.51 -2.32 -0.89 -3.56 -1.12 l 0 -29.91 z m 27.27 116.38 l 0 45.41 l -18.53 10.28 c -2.23 -2.57 -5.27 -4.4 -8.75 -5.03 l 0 -38.57 c 6.17 -1.12 11.05 -5.93 12.24 -12.09 z m -45 0 c 1.16 6 5.81 10.74 11.77 12.01 l 0 38.72 c -3.37 0.72 -6.28 2.59 -8.42 5.13 l -18.66 -10.38 l 0 -45.5 l 15.31 0 z m -15.31 -5.96 l 0 -45.63 l 18.51 -10.27 c 2.15 2.64 5.12 4.58 8.57 5.31 l 0 2.56 c -7.02 1.37 -12.33 7.55 -12.33 14.97 c 0 7.43 5.31 13.62 12.33 14.98 l 0 6.2 c -5.9 1.26 -10.56 5.93 -11.76 11.88 z m 45.26 0 c -1.24 -6.1 -6.1 -10.84 -12.23 -11.95 l 0 -6.13 c 6.99 -1.4 12.27 -7.58 12.27 -14.98 c 0 -7.4 -5.27 -13.57 -12.27 -14.97 l 0 -2.49 c 3.57 -0.66 6.67 -2.56 8.91 -5.23 l 18.36 10.23 l 0 45.52 l -15.06 0 z"
            />

            {/* Mounting holes */}
            <g>
              <circle cx="4" cy="54.25" r="6.5" className="cls-1" />
              <circle cx="4" cy="54.25" r="3.25" fill="url(#hole-gradient)" />
            </g>
            <g>
              <circle cx="4" cy="172.25" r="6.5" className="cls-1" />
              <circle cx="4" cy="172.25" r="3.25" fill="url(#hole-gradient)" />
            </g>
            <g>
              <circle cx="115" cy="54.25" r="6.5" className="cls-1" />
              <circle cx="115" cy="54.25" r="3.25" fill="url(#hole-gradient)" />
            </g>
            <g>
              <circle cx="115" cy="172.25" r="6.5" className="cls-1" />
              <circle cx="115" cy="172.25" r="3.25" fill="url(#hole-gradient)" />
            </g>

            {/* Outer hand */}
            <path
              className="cls-h"
              transform={`translate(${x} ${y + outerPathDesc.yOff}) rotate(${
                270 + outerHandAngle
              }) translate(-${outerPathDesc.xOff}, -${outerPathDesc.yOff})`}
              fill={outerHandColor}
              d={outerPathDesc.path}
            />

            {/* Inner hand */}
            <path
              className="cls-h"
              transform={`translate(${x} ${y + innerPathDesc.yOff}) rotate(${
                270 + innerHandAngle
              }) translate(-${innerPathDesc.xOff}, -${innerPathDesc.yOff})`}
              fill={innerHandColor}
              d={innerPathDesc.path}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
