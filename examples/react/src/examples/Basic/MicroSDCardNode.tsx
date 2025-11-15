import { memo } from 'react';
import { Handle, Position, NodeProps, BuiltInNode } from '@xyflow/react';

const MicroSDCardNode = memo(({ data }: NodeProps<BuiltInNode>) => {
  const pinInfo = [
    { name: 'CD', x: 76.734, y: 9.3744 },
    { name: 'DO', x: 76.734, y: 18.8622 },
    { name: 'GND', x: 76.734, y: 28.4634 },
    { name: 'SCK', x: 76.734, y: 38.178 },
    { name: 'VCC', x: 76.734, y: 47.628 },
    { name: 'DI', x: 76.734, y: 57.456 },
    { name: 'CS', x: 76.734, y: 66.906 },
  ];

  return (
    <div
      style={{
        background: 'transparent',
        position: 'relative',
        width: '81.6px', // 21.6mm converted to px
      }}
    >
      <svg
        width="21.6mm"
        height="20.4mm"
        viewBox="0 0 21.6 20.4"
      >
        {/* Board */}
        <rect width="21.6" height="20.4" fill="#a1111b" />

        {/* Card and socket */}
        <rect
          x="1.32"
          y="4.59"
          width="3.13"
          height="8.06"
          fill="#262626"
          stroke="#d5b7b5"
          strokeWidth="0.232"
        />
        <rect x="4.08" y="0.0367" width="10.7" height="17.8" rx="0.772" ry="0.772" fill="#262626" />
        <path
          d="m3.79 2.49-1.62 0.0292v1.38c0.474 0.0438 0.486 0.0027 0.489 0.197 0.0026 0.194-0.0698 0.237-1.2 0.257v0.939c0.388 0.0184 0.665-0.0702 0.679 0.211l0.176 3.66-0.413 0.434 0.0207 0.733 0.103 0.114 1.15 0.031 0.114-0.114-0.031-0.764-0.361-0.403 0.0413-3.62c0.0103-0.258 0.176-0.283 0.176-0.283h0.34c0.109 0 0.197 0.0689 0.197 0.154v5.29c0 0.0856-0.088 0.154-0.197 0.154h-1.99v6.96h5.2c-0.0402-1.41-0.191-5.31-0.0968-6 0.0155-0.114 0.263-0.0662 0.272-0.0303 0.0551 0.222 0.0216 2.55 0.234 5.65 0.431 0.234 0.17-0.655 0.423-0.635 0.242 0.0186-0.0802 0.81 0.394 0.635 0.384-4 0.0656-5.8 0.365-5.71 0.299 0.0904-0.204 5.36 0.0438 6.09h4.18s-0.17-4.16-0.285-5.96c-0.0099-0.155 0.473-0.156 0.467 0-0.0653 1.63 0.0803 5.67 0.0803 5.67 0.533 0.0657 0.168-0.755 0.46-0.745 0.279 0.0104-0.0511 0.854 0.387 0.745 0 0 0.218-4.08 0.226-5.69 7.07e-4 -0.146 0.375-0.139 0.372 0.0073-0.0227 1.42-0.131 5.97-0.131 5.97h1.01l-0.0656-14.3s-0.24-0.0383-0.352 0.0012c-3.96 1.4-7.81 1.06-10.7-0.0304-0.175-0.212-0.146-0.993-0.146-0.993z"
          fill="#dbded9"
        />
        <rect
          x="5.84"
          y="6.42"
          width="3.97"
          height="1.97"
          rx="0.3"
          ry="0.3"
          fill="#262626"
          stroke="#ebebeb"
          strokeWidth="0.08"
        />
        <rect
          x="10.4"
          y="6.42"
          width="3.97"
          height="1.97"
          rx="0.3"
          ry="0.3"
          fill="#262626"
          stroke="#ebebeb"
          strokeWidth="0.08"
        />
        <path
          d="m4.08 1.21s2.37 0.327 5.27 0.327c2.9 0 5.42-0.327 5.42-0.327v0.57s-0.949 0.331-5.42 0.327c-4.47-0.0037-5.27-0.327-5.27-0.327z"
          fill="#020202"
          stroke="#000"
          strokeWidth="0.027"
        />
        <g fill="#fcfff9">
          <rect x="1.19" y="10.9" width="0.275" height="6.95" />
          <rect x="1.19" y="4.36" width="0.275" height="0.945" />
          <rect x="1.84" y="2.52" width="0.33" height="1.38" />
        </g>

        {/* Pins & labels */}
        <text fontFamily="sans-serif" fill="#ffffff" fontSize="1.6px" strokeWidth="0.0327">
          <tspan x="16.61" y="2.90">CD</tspan>
          <tspan x="16.45" y="5.45">DO</tspan>
          <tspan x="15.39" y="7.98">GND</tspan>
          <tspan x="15.65" y="10.62">SCK</tspan>
          <tspan x="15.68" y="13.06">VCC</tspan>
          <tspan x="16.88" y="15.57">DI</tspan>
          <tspan x="16.67" y="18.24">CS</tspan>
        </text>
        <g fill="#fff" stroke="#d9cb97" strokeWidth="0.381">
          <ellipse cx="20.3" cy="2.48" rx="0.814" ry="0.814" />
          <ellipse cx="20.3" cy="4.99" rx="0.814" ry="0.814" />
          <ellipse cx="20.3" cy="7.53" rx="0.814" ry="0.814" />
          <ellipse cx="20.3" cy="10.1" rx="0.814" ry="0.814" />
          <ellipse cx="20.3" cy="12.6" rx="0.814" ry="0.814" />
          <ellipse cx="20.3" cy="15.2" rx="0.814" ry="0.814" />
          <ellipse cx="20.3" cy="17.7" rx="0.814" ry="0.814" />
        </g>
      </svg>

      {/* Handles for pins */}
      {pinInfo.map((pin, index) => (
        <Handle
          key={`${pin.name}-source-${index}`}
          type="source"
          position={Position.Right}
          id={`${pin.name}-source`}
          style={{
            left: `${pin.x - 7}px`,
            top: `${pin.y}px`,
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
          position={Position.Right}
          id={`${pin.name}-target`}
          style={{
            left: `${pin.x - 7}px`,
            top: `${pin.y}px`,
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

MicroSDCardNode.displayName = 'MicroSDCardNode';

export default MicroSDCardNode;
