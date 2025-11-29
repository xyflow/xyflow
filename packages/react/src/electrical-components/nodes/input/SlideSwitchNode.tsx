import { memo, useState } from 'react';
import { Handle, Position, NodeProps, BuiltInNode } from '@xyflow/react';

const SlideSwitchNode = ({ id }: NodeProps<BuiltInNode>) => {
  const [checked, setChecked] = useState(false);

  const pinInfo = [
    { name: '1', number: 1, y: 34, x: 6.5, signals: [] },
    { name: '2', number: 2, y: 34, x: 16, signals: [] },
    { name: '3', number: 3, y: 34, x: 25.5, signals: [] },
  ];

  const handleClick = () => {
    setChecked(!checked);
  };

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
        width="8.5mm"
        height="9.23mm"
        version="1.1"
        viewBox="0 0 8.5 9.23"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        <defs>
          <radialGradient
            id={`gradient-${id}`}
            cx="9.33"
            cy="122"
            r="4.25"
            gradientTransform="matrix(1.75 -.511 .28 .959 -41.2 8.15)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#808080" offset="0" />
            <stop stopColor="#b5b5b5" offset="1" />
          </radialGradient>
        </defs>
        <g fill="#aaa" strokeWidth=".0673">
          <rect x="4" y="5" width=".5" height="4.2" rx=".25" ry=".25" />
          <rect x="1.54" y="5" width=".5" height="4.2" rx=".25" ry=".25" />
          <rect x="6.5" y="5" width=".5" height="4.2" rx=".25" ry=".25" />
        </g>
        <path
          d="m2.74 0.128 0.145-0.128 0.177 0.0725 0.174-0.0725 0.151 0.0725 0.154-0.0725 0.151 0.0725 0.128-0.0725 0.134 0.0725 0.123-0.0725 0.145 0.128 2e-5 2h-1.48z"
          strokeWidth=".0623"
          style={{
            transform: checked ? 'translate(2px, 0)' : 'translate(0, 0)',
            transition: 'transform 0.2s linear',
          }}
        />
        <rect
          x="0"
          y="2.06"
          width="8.5"
          height="3.48"
          fill={`url(#gradient-${id})`}
          strokeWidth=".0548"
        />
        <rect x=".0322" y="4.74" width="1.55" height=".805" strokeWidth=".0637" />
        <rect x="6.95" y="4.74" width="1.55" height=".805" strokeWidth=".0637" />
        <rect x="2.55" y="4.74" width="3.47" height=".805" strokeWidth=".0955" />
      </svg>
    </div>
  );
};

export default memo(SlideSwitchNode);
