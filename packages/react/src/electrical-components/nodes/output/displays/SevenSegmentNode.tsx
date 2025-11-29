import { Position, Handle, NodeProps, BuiltInNode } from '@xyflow/react';
import { useState } from 'react';

const mmToPix = 3.7795275591;

interface Signal {
  type: string;
  signal?: string;
  voltage?: number;
}

interface ElementPin {
  name: string;
  number: number;
  x: number;
  y: number;
  signals: Signal[];
  description: string;
}

export type SevenSegmentNodeData = {
  label?: string;
  color?: string;
  offColor?: string;
  background?: string;
  digits?: number;
  colon?: boolean;
  colonValue?: boolean;
  pins?: 'top' | 'extend' | 'none';
  values?: number[];
  [key: string]: unknown;
};

export default function SevenSegmentNode({ data, isConnectable }: NodeProps<BuiltInNode>) {
  const nodeData = data as SevenSegmentNodeData;
  const color = nodeData?.color || 'red';
  const offColor = nodeData?.offColor || '#444';
  const background = nodeData?.background || 'black';
  const digits = nodeData?.digits || 1;
  const colon = nodeData?.colon || false;
  const colonValue = nodeData?.colonValue || false;
  const pins = nodeData?.pins || 'top';
  const values = nodeData?.values || [0, 0, 0, 0, 0, 0, 0, 0];

  const [segmentValues] = useState<number[]>(values);

  const getPinPositions = () => {
    const numPins = digits === 4 ? 14 : digits === 3 ? 12 : 10;
    const cols = Math.ceil(numPins / 2);
    return {
      startX: (12.55 * digits - cols * 2.54) / 2,
      bottomY: pins === 'extend' ? 21 : 18,
      cols,
    };
  };

  const pinXY = (n: number) => {
    const { startX, cols, bottomY } = getPinPositions();
    const col = (n - 1) % cols;
    const row = 1 - Math.floor((n - 1) / cols);
    const xOffset = 1.27;
    const x = startX + xOffset + (row ? col : cols - col - 1) * 2.54;
    const y = pins === 'top' ? (row ? bottomY + 1 : 1) : row ? bottomY + 2 : 0;
    return { number: n, x: x * mmToPix, y: y * mmToPix };
  };

  const getPinInfo = (): ElementPin[] => {
    switch (digits) {
      case 4:
        return [
          { name: 'A', ...pinXY(13), signals: [], description: 'Segment A' },
          { name: 'B', ...pinXY(9), signals: [], description: 'Segment B' },
          { name: 'C', ...pinXY(4), signals: [], description: 'Segment C' },
          { name: 'D', ...pinXY(2), signals: [], description: 'Segment D' },
          { name: 'E', ...pinXY(1), signals: [], description: 'Segment E' },
          { name: 'F', ...pinXY(12), signals: [], description: 'Segment F' },
          { name: 'G', ...pinXY(5), signals: [], description: 'Segment G' },
          { name: 'DP', ...pinXY(3), signals: [], description: 'Decimal Point' },
          { name: 'DIG1', ...pinXY(14), signals: [], description: 'Digit 1 Common' },
          { name: 'DIG2', ...pinXY(11), signals: [], description: 'Digit 2 Common' },
          { name: 'DIG3', ...pinXY(10), signals: [], description: 'Digit 3 Common' },
          { name: 'DIG4', ...pinXY(6), signals: [], description: 'Digit 4 Common' },
          { name: 'COM', ...pinXY(7), signals: [], description: 'Common pin' },
          { name: 'CLN', ...pinXY(8), signals: [], description: 'Colon' },
        ];
      case 3:
        return [
          { name: 'A', ...pinXY(11), signals: [], description: 'Segment A' },
          { name: 'B', ...pinXY(7), signals: [], description: 'Segment B' },
          { name: 'C', ...pinXY(4), signals: [], description: 'Segment C' },
          { name: 'D', ...pinXY(2), signals: [], description: 'Segment D' },
          { name: 'E', ...pinXY(1), signals: [], description: 'Segment E' },
          { name: 'F', ...pinXY(10), signals: [], description: 'Segment F' },
          { name: 'G', ...pinXY(5), signals: [], description: 'Segment G' },
          { name: 'DP', ...pinXY(3), signals: [], description: 'Decimal Point' },
          { name: 'DIG1', ...pinXY(12), signals: [], description: 'Digit 1 Common' },
          { name: 'DIG2', ...pinXY(9), signals: [], description: 'Digit 2 Common' },
          { name: 'DIG3', ...pinXY(8), signals: [], description: 'Digit 3 Common' },
        ];
      case 2:
        return [
          { name: 'DIG1', ...pinXY(8), signals: [], description: 'Digit 1 Common' },
          { name: 'DIG2', ...pinXY(7), signals: [], description: 'Digit 2 Common' },
          { name: 'A', ...pinXY(10), signals: [], description: 'Segment A' },
          { name: 'B', ...pinXY(9), signals: [], description: 'Segment B' },
          { name: 'C', ...pinXY(1), signals: [], description: 'Segment C' },
          { name: 'D', ...pinXY(4), signals: [], description: 'Segment D' },
          { name: 'E', ...pinXY(3), signals: [], description: 'Segment E' },
          { name: 'F', ...pinXY(6), signals: [], description: 'Segment F' },
          { name: 'G', ...pinXY(5), signals: [], description: 'Segment G' },
          { name: 'DP', ...pinXY(2), signals: [], description: 'Decimal Point' },
        ];
      case 1:
      default:
        return [
          { name: 'COM.1', ...pinXY(3), signals: [], description: 'Common' },
          { name: 'COM.2', ...pinXY(8), signals: [], description: 'Common' },
          { name: 'A', ...pinXY(7), signals: [], description: 'Segment A' },
          { name: 'B', ...pinXY(6), signals: [], description: 'Segment B' },
          { name: 'C', ...pinXY(4), signals: [], description: 'Segment C' },
          { name: 'D', ...pinXY(2), signals: [], description: 'Segment D' },
          { name: 'E', ...pinXY(1), signals: [], description: 'Segment E' },
          { name: 'F', ...pinXY(9), signals: [], description: 'Segment F' },
          { name: 'G', ...pinXY(10), signals: [], description: 'Segment G' },
          { name: 'DP', ...pinXY(5), signals: [], description: 'Decimal Point' },
        ];
    }
  };

  const renderDigit = (x: number, startIndex: number) => {
    const fill = (index: number) => (segmentValues[startIndex + index] ? color : offColor);
    const yOffset = pins === 'extend' ? 2 : 0;

    return (
      <g
        key={`digit-${startIndex}`}
        transform={`skewX(-8) translate(${x}, ${yOffset + 2.4}) scale(0.81)`}
        style={{
          transform: 'scale(0.9)',
          transformOrigin: '50% 50%',
          transformBox: 'fill-box',
        }}
      >
        <polygon points="2 0 8 0 9 1 8 2 2 2 1 1" fill={fill(0)} />
        <polygon points="10 2 10 8 9 9 8 8 8 2 9 1" fill={fill(1)} />
        <polygon points="10 10 10 16 9 17 8 16 8 10 9 9" fill={fill(2)} />
        <polygon points="8 18 2 18 1 17 2 16 8 16 9 17" fill={fill(3)} />
        <polygon points="0 16 0 10 1 9 2 10 2 16 1 17" fill={fill(4)} />
        <polygon points="0 8 0 2 1 1 2 2 2 8 1 9" fill={fill(5)} />
        <polygon points="2 8 8 8 9 9 8 10 2 10 1 9" fill={fill(6)} />
        <circle cx={x + 7.4} cy={yOffset + 16} r="0.89" fill={fill(7)} />
      </g>
    );
  };

  const renderColon = () => {
    const yOffset = pins === 'extend' ? 2 : 0;
    const colonPosition = 1.5 + 12.7 * Math.round(digits / 2);
    const colonFill = colonValue ? color : offColor;
    return (
      <g transform="skewX(-8)" fill={colonFill}>
        <circle cx={colonPosition} cy={yOffset + 5.75} r="0.89" />
        <circle cx={colonPosition} cy={yOffset + 13.25} r="0.89" />
      </g>
    );
  };

  const renderPins = () => {
    const { cols, bottomY, startX: x } = getPinPositions();
    return (
      <g fill="url(#pin-pattern)" transform={`translate(${x}, 0)`}>
        <rect height="2" width={cols * 2.54} />
        <rect height="2" width={cols * 2.54} transform={`translate(0, ${bottomY})`} />
      </g>
    );
  };

  const width = 12.55 * digits;
  const height = pins === 'extend' ? 23 : 22;
  const yOffset = pins === 'extend' ? 2 : 0;
  const pinInfo = getPinInfo();

  return (
    <>
      {nodeData?.label && <div style={{ marginBottom: '8px' }}>{nodeData.label}</div>}
      <div style={{ position: 'relative' }}>
        {pinInfo.map((pin) => {
          const handleStyle = {
            position: 'absolute' as const,
            left: `${pin.x - 7}px`,
            top: `${pin.y}px`,
            width: '4px',
            height: '4px',
            background: pin.signals.some((s) => s.type === 'power') ? '#ff0072' : '#1a192b',
            border: '1px solid white',
            cursor: 'crosshair',
          };

          return (
            <div key={pin.name}>
              <Handle
                type="source"
                position={Position.Right}
                id={pin.name}
                isConnectable={isConnectable}
                style={handleStyle}
              />
              <Handle
                type="target"
                position={Position.Right}
                id={pin.name}
                isConnectable={isConnectable}
                style={handleStyle}
              />
            </div>
          );
        })}
        <svg
          width={`${width}mm`}
          height={`${height}mm`}
          version="1.1"
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="pin-pattern" height="2" width="2.54" patternUnits="userSpaceOnUse">
              {pins === 'extend' ? (
                <rect x="1.02" y="0" height="2" width="0.5" fill="#aaa" />
              ) : (
                <circle cx="1.27" cy="1" r="0.5" fill="#aaa" />
              )}
            </pattern>
          </defs>
          <rect x="0" y={yOffset} width={width} height="20.5" fill={background} />
          {Array.from({ length: digits }, (_, i) => renderDigit(3.5 + i * 12.7, i * 8))}
          {colon && renderColon()}
          {pins !== 'none' && renderPins()}
        </svg>
      </div>
    </>
  );
}
