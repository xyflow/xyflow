import { memo, useState } from 'react';
import { Handle, Position, NodeProps, BuiltInNode } from '@xyflow/react';

const LEDRingNode = memo(({ data }: NodeProps<BuiltInNode>) => {
  const pixels = (data.pixels as number) || 24;
  const [pixelColors, setPixelColors] = useState<string[]>(
    Array(pixels).fill('#000000')
  );

  // Pin configuration for DIN/DOUT support
  const pinInfo = [
    { name: 'GND', x: 16, y: 90 },
    { name: 'VCC', x: 25.6, y: 90 },
    { name: 'DIN', x: 35.2, y: 90 },
    { name: 'DOUT', x: 44.8, y: 90 },
  ];

  // Calculate LED positions in a circle
  const centerX = 30;
  const centerY = 30;
  const radius = 20;
  const leds = Array.from({ length: pixels }, (_, i) => {
    const angle = (i * 2 * Math.PI) / pixels - Math.PI / 2; // Start from top
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      color: pixelColors[i],
    };
  });

  return (
    <div
      style={{
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '10px',
        position: 'relative',
        width: '60px',
      }}
    >
      <svg width="60" height="90" viewBox="0 0 60 90">
        <defs>
          <filter id="ledring-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* PCB background */}
        <rect x="5" y="5" width="50" height="80" rx="3" fill="#1c5c2e" />

        {/* LED ring circle */}
        {leds.map((led, i) => (
          <g key={i}>
            {/* LED body */}
            <circle
              cx={led.x}
              cy={led.y}
              r="2.5"
              fill="#222"
              stroke="#666"
              strokeWidth="0.5"
            />
            {/* LED light */}
            {led.color !== '#000000' && (
              <circle
                cx={led.x}
                cy={led.y}
                r="2"
                fill={led.color}
                filter="url(#ledring-glow)"
                opacity="0.9"
              />
            )}
          </g>
        ))}

        {/* Center hole */}
        <circle cx={centerX} cy={centerY} r="8" fill="#0a0a0a" stroke="#666" strokeWidth="0.5" />

        {/* Pin labels */}
        {pinInfo.map((pin, i) => (
          <text
            key={i}
            x={pin.x}
            y={pin.y - 3}
            fontSize="4"
            fill="#fff"
            textAnchor="middle"
          >
            {pin.name}
          </text>
        ))}
      </svg>

      {/* Handles for pins */}
      {pinInfo.map((pin, index) => (
        <Handle
          key={`${pin.name}-${index}`}
          type="source"
          position={Position.Bottom}
          id={`${pin.name}-source`}
          style={{
            left: `${pin.x}px`,
            bottom: '-5px',
            width: '8px',
            height: '8px',
            background: pin.name === 'VCC' ? '#ff0072' : '#1a192b',
            border: '2px solid #fff',
          }}
        />
      ))}
      {pinInfo.map((pin, index) => (
        <Handle
          key={`${pin.name}-target-${index}`}
          type="target"
          position={Position.Bottom}
          id={`${pin.name}-target`}
          style={{
            left: `${pin.x}px`,
            bottom: '-5px',
            width: '8px',
            height: '8px',
            background: pin.name === 'VCC' ? '#ff0072' : '#1a192b',
            border: '2px solid #fff',
          }}
        />
      ))}
    </div>
  );
});

LEDRingNode.displayName = 'LEDRingNode';

export default LEDRingNode;
