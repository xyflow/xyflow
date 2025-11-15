import { memo } from 'react';
import { Handle, Position, NodeProps, BuiltInNode } from '@xyflow/react';

const LedBarGraphNode = ({ data }: NodeProps<BuiltInNode>) => {
  const mm = 3.7795275591;
  const anodeX = 1.27 * mm;
  const cathodeX = 8.83 * mm;

  const color = (data.color as string) || 'red';
  const offColor = (data.offColor as string) || '#444';
  const values = (data.values as number[]) || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  const green = '#9eff3c';
  const blue = '#2c95fa';
  const cyan = '#6cf9dc';
  const yellow = '#f1d73c';
  const red = '#dc012d';

  const colorPalettes: Record<string, string[]> = {
    GYR: [green, green, green, green, green, yellow, yellow, yellow, red, red],
    BCYR: [blue, cyan, cyan, cyan, cyan, yellow, yellow, yellow, red, red],
  };

  const palette = colorPalettes[color];
  const segments = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const pinInfo = [
    { name: 'A1', x: anodeX, y: 1.27 * mm, number: 1, isPower: false, position: Position.Left },
    { name: 'A2', x: anodeX, y: 3.81 * mm, number: 2, isPower: false, position: Position.Left },
    { name: 'A3', x: anodeX, y: 6.35 * mm, number: 3, isPower: false, position: Position.Left },
    { name: 'A4', x: anodeX, y: 8.89 * mm, number: 4, isPower: false, position: Position.Left },
    { name: 'A5', x: anodeX, y: 11.43 * mm, number: 5, isPower: false, position: Position.Left },
    { name: 'A6', x: anodeX, y: 13.97 * mm, number: 6, isPower: false, position: Position.Left },
    { name: 'A7', x: anodeX, y: 16.51 * mm, number: 7, isPower: false, position: Position.Left },
    { name: 'A8', x: anodeX, y: 19.05 * mm, number: 8, isPower: false, position: Position.Left },
    { name: 'A9', x: anodeX, y: 21.59 * mm, number: 9, isPower: false, position: Position.Left },
    { name: 'A10', x: anodeX, y: 24.13 * mm, number: 10, isPower: false, position: Position.Left },
    { name: 'C1', x: cathodeX, y: 1.27 * mm, number: 20, isPower: false, position: Position.Right },
    { name: 'C2', x: cathodeX, y: 3.81 * mm, number: 19, isPower: false, position: Position.Right },
    { name: 'C3', x: cathodeX, y: 6.35 * mm, number: 18, isPower: false, position: Position.Right },
    { name: 'C4', x: cathodeX, y: 8.89 * mm, number: 17, isPower: false, position: Position.Right },
    { name: 'C5', x: cathodeX, y: 11.43 * mm, number: 16, isPower: false, position: Position.Right },
    { name: 'C6', x: cathodeX, y: 13.97 * mm, number: 15, isPower: false, position: Position.Right },
    { name: 'C7', x: cathodeX, y: 16.51 * mm, number: 14, isPower: false, position: Position.Right },
    { name: 'C8', x: cathodeX, y: 19.05 * mm, number: 13, isPower: false, position: Position.Right },
    { name: 'C9', x: cathodeX, y: 21.59 * mm, number: 12, isPower: false, position: Position.Right },
    { name: 'C10', x: cathodeX, y: 24.13 * mm, number: 11, isPower: false, position: Position.Right },
  ];

  return (
    <div style={{ position: 'relative' }}>
      {pinInfo.map((pin) => {
        const handleStyle = {
          position: 'absolute' as const,
          left: pin.position === Position.Left ? `${pin.x}px` : `${pin.x - 7}px`,
          top: `${pin.y}px`,
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          border: '1px solid #555',
          background: pin.isPower ? '#ff0072' : '#1a192b',
        };

        return (
          <div key={pin.name}>
            <Handle
              type="target"
              position={pin.position}
              id={`${pin.name}-target`}
              style={handleStyle}
            />
            <Handle
              type="source"
              position={pin.position}
              id={`${pin.name}-source`}
              style={handleStyle}
            />
          </div>
        );
      })}

      <svg
        width="10.1mm"
        height="25.5mm"
        version="1.1"
        viewBox="0 0 10.1 25.5"
        xmlns="http://www.w3.org/2000/svg"
        style={{ userSelect: 'none' }}
      >
        <pattern id="pin-pattern" height="2.54" width="10.1" patternUnits="userSpaceOnUse">
          <circle cx="1.27" cy="1.27" r="0.5" fill="#aaa" />
          <circle cx="8.83" cy="1.27" r="0.5" fill="#aaa" />
        </pattern>
        <path d="m1.4 0h8.75v25.5h-10.1v-24.2z" />
        <rect width="10.1" height="25.4" fill="url(#pin-pattern)" />
        {segments.map((index) => (
          <rect
            key={index}
            x="2.5"
            y={0.4 + index * 2.54}
            width="5"
            height="1.74"
            fill={values[index] ? (palette?.[index] ?? color) : offColor}
          />
        ))}
      </svg>
    </div>
  );
};

LedBarGraphNode.displayName = 'LedBarGraphNode';

export default memo(LedBarGraphNode);
