import { Position, Handle, NodeProps, BuiltInNode } from '@xyflow/react';
import { useState } from 'react';

export type BuzzerNodeData = {
  label?: string;
  hasSignal?: boolean;
  [key: string]: unknown;
};

export default function BuzzerNode({ data, isConnectable }: NodeProps<BuiltInNode>) {
  const nodeData = data as BuzzerNodeData;
  const [hasSignal] = useState(nodeData.hasSignal || false);

  const pinInfo = [
    { name: '1', x: 27, y: 84, position: Position.Bottom },
    { name: '2', x: 37, y: 84, position: Position.Bottom },
  ];

  return (
    <div style={{ position: 'relative' }}>
      {pinInfo.map((pin) => {
        const handleStyle = {
          position: 'absolute' as const,
          left: `${pin.x}px`,
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

      <div style={{ display: 'flex', flexDirection: 'column', width: '75px' }}>
        {/* Music Note - shown when hasSignal is true */}
        <svg
          style={{
            position: 'relative',
            left: '40px',
            visibility: hasSignal ? 'visible' : 'hidden',
            transform: 'scale(1.5)',
            fill: 'blue',
          }}
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="8"
          viewBox="0 0 8 8"
        >
          <path d="M8 0c-5 0-6 1-6 1v4.09c-.15-.05-.33-.09-.5-.09-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5v-3.97c.73-.23 1.99-.44 4-.5v2.06c-.15-.05-.33-.09-.5-.09-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5v-5.5z" />
        </svg>

        {/* Buzzer SVG */}
        <svg
          width="17mm"
          height="20mm"
          version="1.1"
          viewBox="0 0 17 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m7.23 16.5v3.5" fill="none" stroke="#000" strokeWidth=".5" />
          <path d="m9.77 16.5v3.5" fill="#f00" stroke="#f00" strokeWidth=".5" />
          <g stroke="#000">
            <g>
              <ellipse cx="8.5" cy="8.5" rx="8.15" ry="8.15" fill="#1a1a1a" strokeWidth=".7" />
              <circle
                cx="8.5"
                cy="8.5"
                r="6.3472"
                fill="none"
                strokeWidth=".3"
                style={{ paintOrder: 'normal' }}
              />
              <circle
                cx="8.5"
                cy="8.5"
                r="4.3488"
                fill="none"
                strokeWidth=".3"
                style={{ paintOrder: 'normal' }}
              />
            </g>
            <circle cx="8.5" cy="8.5" r="1.3744" fill="#ccc" strokeWidth=".25" />
          </g>
        </svg>
      </div>
    </div>
  );
}
