import { Position, Handle, NodeProps, BuiltInNode } from '@xyflow/react';
import { useState } from 'react';

export default function AnalogJoystickNode({ data, isConnectable }: NodeProps<BuiltInNode>) {
  const [xValue, setXValue] = useState(0);
  const [yValue, setYValue] = useState(0);

  const pinInfo = [
    { name: 'VCC', x: 33, y: 115.8 },
    { name: 'VERT', x: 42.6, y: 115.8 },
    { name: 'HORZ', x: 52.2, y: 115.8 },
    { name: 'SEL', x: 61.8, y: 115.8 },
    { name: 'GND', x: 71.4, y: 115.8 },
  ];

  return (
    <>
      <div style={{ position: 'relative' }}>
        {pinInfo.map((pin) => {
          const handleStyle = {
            position: 'absolute' as const,
            left: `${pin.x - 7}px`,
            top: `${pin.y}px`,
            width: '4px',
            height: '4px',
            background: pin.name === 'VCC' || pin.name === 'GND' ? '#ff0072' : '#1a192b',
            border: '1px solid white',
            cursor: 'crosshair',
          };

          return (
            <div key={pin.name}>
              <Handle type="source" position={Position.Right} id={pin.name} isConnectable={isConnectable} style={handleStyle} />
              <Handle type="target" position={Position.Right} id={pin.name} isConnectable={isConnectable} style={handleStyle} />
            </div>
          );
        })}
        <svg width="27.2mm" height="31.8mm" viewBox="0 0 27.2 31.8" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.3 0v31.7h25.5V0zm2.33.683a1.87 1.87 0 01.009 0 1.87 1.87 0 011.87 1.87 1.87 1.87 0 01-1.87 1.87 1.87 1.87 0 01-1.87-1.87 1.87 1.87 0 011.87-1.87zm20.5 0a1.87 1.87 0 01.009 0 1.87 1.87 0 011.87 1.87 1.87 1.87 0 01-1.87 1.87 1.87 1.87 0 01-1.87-1.87 1.87 1.87 0 011.87-1.87zm-20.5 26.8a1.87 1.87 0 01.009 0 1.87 1.87 0 011.87 1.87 1.87 1.87 0 01-1.87 1.87 1.87 1.87 0 01-1.87-1.87 1.87 1.87 0 011.87-1.87zm20.4 0a1.87 1.87 0 01.009 0 1.87 1.87 0 011.87 1.87 1.87 1.87 0 01-1.87 1.87 1.87 1.87 0 01-1.87-1.87 1.87 1.87 0 011.87-1.87zm-12.7 2.66a.489.489 0 01.004 0 .489.489 0 01.489.489.489.489 0 01-.489.489.489.489 0 01-.489-.489.489.489 0 01.485-.489zm2.57 0a.489.489 0 01.004 0 .489.489 0 01.489.489.489.489 0 01-.489.489.489.489 0 01-.489-.489.489.489 0 01.485-.489zm2.49.013a.489.489 0 01.004 0 .489.489 0 01.489.489.489.489 0 01-.489.489.489.489 0 01-.489-.489.489.489 0 01.485-.489zm-7.62.007a.489.489 0 01.004 0 .489.489 0 01.489.489.489.489 0 01-.489.489.489.489 0 01-.489-.49.489.489 0 01.485-.488zm10.2.013a.489.489 0 01.004 0 .489.489 0 01.489.489.489.489 0 01-.489.489.489.489 0 01-.489-.49.489.489 0 01.485-.488z" fill="#bd1e34" />
          <ellipse cx="13.6" cy="13.7" rx="13.6" ry="13.7" fill="#000" />
          <circle cx="13.6" cy="13.6" transform={`translate(${2.5 * -xValue}, ${2.5 * -yValue})`} r="10.6" fill="#333" style={{ transition: 'transform 0.3s' }} />
          <text fill="#fff" fontFamily="sans-serif" fontSize="1.2px" textAnchor="middle">
            <tspan x="4.034" y="25.643">Analog</tspan>
            <tspan x="4.061" y="27.159">Joystick</tspan>
          </text>
        </svg>
      </div>
    </>
  );
}
