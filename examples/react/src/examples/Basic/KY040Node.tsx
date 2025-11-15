import { memo, useState } from 'react';
import { Handle, Position, NodeProps, BuiltInNode } from '@xyflow/react';

const KY040Node = ({ data }: NodeProps<BuiltInNode>) => {
  const [angle, setAngle] = useState((data.angle as number) || 0);
  const [pressed, setPressed] = useState(false);
  const stepSize = (data.stepSize as number) || 18;

  const pinInfo = [
    { name: 'CLK', y: 7.9, x: 116, number: 1, isPower: false, position: Position.Right },
    { name: 'DT', y: 17.4, x: 116, number: 2, isPower: false, position: Position.Right },
    { name: 'SW', y: 27, x: 116, number: 3, isPower: false, position: Position.Right },
    { name: 'VCC', y: 36.3, x: 116, number: 4, isPower: true, position: Position.Right },
    { name: 'GND', y: 45.5, x: 116, number: 5, isPower: true, position: Position.Right },
  ];

  const clockwiseStep = () => {
    setAngle((prev) => (prev + stepSize) % 360);
  };

  const counterClockwiseStep = () => {
    setAngle((prev) => (prev - stepSize + 360) % 360);
  };

  const handlePress = () => {
    setPressed(true);
  };

  const handleRelease = () => {
    setPressed(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      {pinInfo.map((pin) => {
        const handleStyle = {
          position: 'absolute' as const,
          left: `${pin.x}px`,
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
        width="30.815mm"
        height="18.63mm"
        version="1.1"
        viewBox="0 0 116 70.4"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{ userSelect: 'none' }}
      >
        <defs>
          <linearGradient
            id="a"
            x1="158"
            x2="170"
            y1="86.5"
            y2="86.5"
            gradientTransform="translate(-75.1 -60.1)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4d4d4d" offset="0" />
            <stop stopColor="#4d4d4d" stopOpacity="0" offset="1" />
          </linearGradient>
        </defs>

        {/* Board */}
        <path
          d="m0 0v70.4h99v-70.4zm18 56.5a6.5 6.5 0 0 1 6.5 6.5 6.5 6.5 0 0 1-6.5 6.5 6.5 6.5 0 0 1-6.5-6.5 6.5 6.5 0 0 1 6.5-6.5zm63.8 0.213a6.5 6.5 0 0 1 6.5 6.5 6.5 6.5 0 0 1-6.5 6.5 6.5 6.5 0 0 1-6.5-6.5 6.5 6.5 0 0 1 6.5-6.5z"
          fill="#1a1a1a"
          fillRule="evenodd"
        />

        {/* Rotator */}
        <g fill="#ccc" fillRule="evenodd">
          <rect x="9.05" y="17.4" width="6.95" height="2.47" rx=".756" />
          <rect x="9.15" y="26.5" width="6.95" height="2.47" rx=".756" />
          <rect x="9.05" y="36.1" width="6.95" height="2.47" rx=".756" />
        </g>

        <g>
          <rect x="12.2" y="8.05" width="48.4" height="41" rx="7.12" fill="#e6e6e6" />

          <circle cx="36.6" cy="28.5" r="13.5" fill="#666" />
          <rect x="32.5" y="7.87" width="7.42" height="41.5" fill="#666" />

          {/* Handle */}
          <path
            transform={`rotate(${angle}, 36.244, 28.5)`}
            d="m36.3 21.4a7.03 7.14 0 0 0-3.74 1.1v12.1a7.03 7.14 0 0 0 3.74 1.1 7.03 7.14 0 0 0 7.03-7.14 7.03 7.14 0 0 0-7.03-7.14z"
            fill={pressed ? '#fff' : '#ccc'}
            stroke="#060606"
            strokeWidth=".3"
            style={{ cursor: 'pointer' }}
            onMouseDown={handlePress}
            onMouseUp={handleRelease}
            onMouseLeave={handleRelease}
          />

          {/* Counter Clockwise Arrow */}
          <g
            onClick={counterClockwiseStep}
            style={{ cursor: 'pointer' }}
          >
            <circle cx="20" cy="43" r="12" fill="red" opacity="0" />
            <path
              d="m21 44.5c-5.17-1.78-7.55-5.53-6.6-11.2 0.0662-0.327 0.107-0.938 0.272-1.06 0.204-0.137 0.312-0.116 0.39-0.1 0.0775 0.0152 0.139 0.0274 0.189 0.102 0.846 3.81 3.13 6.84 6.57 7.59 0.304-0.787 0.461-3.32 0.826-3.24 0.428 0.0848 4.31 5.73 4.93 6.65-0.978 0.839-6.07 4.44-6.95 4.28 0 0 0.206-2.19 0.362-2.96z"
              fill="#b3b3b3"
              stroke="#000"
              strokeWidth=".0625px"
            />
          </g>

          {/* Clockwise Arrow */}
          <g
            onClick={clockwiseStep}
            style={{ cursor: 'pointer' }}
          >
            <circle cx="20" cy="15" r="12" fill="red" opacity="0" />
            <path
              d="m21.2 12.1c-5.17 1.78-7.55 5.53-6.6 11.2 0.0662 0.327 0.107 0.938 0.272 1.06 0.204 0.137 0.312 0.116 0.39 0.1 0.0775-0.0152 0.139-0.0274 0.189-0.102 0.846-3.81 3.13-6.84 6.57-7.59 0.304 0.787 0.461 3.32 0.826 3.24 0.428-0.0848 4.31-5.73 4.93-6.65-0.978-0.839-6.07-4.44-6.95-4.28 0 0 0.206 2.19 0.362 2.96z"
              fill="#b3b3b3"
              stroke="#022"
              strokeWidth=".0625px"
            />
          </g>
        </g>

        {/* Chip Pins */}
        <rect
          x="83"
          y="1.72"
          width="10.9"
          height="49.2"
          fill="url(#a)"
          fillRule="evenodd"
          opacity=".65"
          stroke="#fff"
          strokeWidth="1.16"
        />
        <g fill="#ccc" fillRule="evenodd">
          <rect x="86.9" y="6.54" width="28.9" height="2.47" rx=".877" />
          <rect x="86.8" y="15.9" width="28.9" height="2.47" rx=".877" />
          <rect x="87.1" y="25.6" width="28.9" height="2.47" rx=".877" />
          <rect x="87.1" y="34.9" width="28.9" height="2.47" rx=".877" />
          <rect x="87.6" y="44.1" width="28.9" height="2.47" rx=".877" />
        </g>
        <g fill="#ffffff" fontFamily="sans-serif">
          <text x="65.55" y="12.13" fontSize="7.29px" fill="#ffffff" strokeWidth=".182">CLK</text>
          <text x="65.02" y="21.93" fontSize="7.44px" fill="#ffffff">DT</text>
          <text x="65.29" y="31.26" fontSize="7.54px" fill="#ffffff">SW</text>
          <text x="70.42" y="39.99" fontSize="6.82px" fill="#ffffff">+</text>
          <text x="64.31" y="49.74" fontSize="7.59px" fill="#ffffff">GND</text>
        </g>
      </svg>
    </div>
  );
};

KY040Node.displayName = 'KY040Node';

export default memo(KY040Node);
