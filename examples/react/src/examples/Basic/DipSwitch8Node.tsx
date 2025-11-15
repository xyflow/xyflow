import { Position, Handle, NodeProps, BuiltInNode } from '@xyflow/react';
import { useState } from 'react';

export type DipSwitch8NodeData = {
  label?: string;
  values?: number[];
  [key: string]: unknown;
};

export default function DipSwitch8Node({ data, isConnectable }: NodeProps<BuiltInNode>) {
  const nodeData = data as DipSwitch8NodeData;
  const [values, setValues] = useState(nodeData.values || [0, 0, 0, 0, 0, 0, 0, 0]);

  const pinInfo = [
    { name: '1a', number: 1, y: 51.3, x: 8.1, position: Position.Bottom },
    { name: '2a', number: 2, y: 51.3, x: 17.7, position: Position.Bottom },
    { name: '3a', number: 3, y: 51.3, x: 27.3, position: Position.Bottom },
    { name: '4a', number: 4, y: 51.3, x: 36.9, position: Position.Bottom },
    { name: '5a', number: 5, y: 51.3, x: 46.5, position: Position.Bottom },
    { name: '6a', number: 6, y: 51.3, x: 56.1, position: Position.Bottom },
    { name: '7a', number: 7, y: 51.3, x: 65.7, position: Position.Bottom },
    { name: '8a', number: 8, y: 51.3, x: 75.3, position: Position.Bottom },

    { name: '8b', number: 9, y: 3, x: 75.3, position: Position.Top },
    { name: '7b', number: 10, y: 3, x: 65.7, position: Position.Top },
    { name: '6b', number: 11, y: 3, x: 56.1, position: Position.Top },
    { name: '5b', number: 12, y: 3, x: 46.5, position: Position.Top },
    { name: '4b', number: 13, y: 3, x: 36.9, position: Position.Top },
    { name: '3b', number: 14, y: 3, x: 27.3, position: Position.Top },
    { name: '2b', number: 15, y: 3, x: 17.7, position: Position.Top },
    { name: '1b', number: 16, y: 3, x: 8.1, position: Position.Top },
  ];

  const toggleSwitch = (index: number) => {
    const newValues = [...values];
    newValues[index] = newValues[index] ? 0 : 1;
    setValues(newValues);
  };

  const drawSwitch = (index: number, x: number) => (
    <g key={index}>
      <rect
        onClick={() => toggleSwitch(index)}
        x={x + 4.693}
        y="21.2"
        width="5.8168"
        height="13"
        fill="transparent"
        cursor="pointer"
      />
      <use
        onClick={() => toggleSwitch(index)}
        xlinkHref="#switch"
        x={x}
        y={values[index] ? -7.2 : 0}
        cursor="pointer"
      />
    </g>
  );

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

      <svg
        width="82.87"
        height="55.355"
        version="1.1"
        viewBox="0 0 82.87 55.355"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <path
            id="switch"
            transform="translate(-66.856 -41.367)"
            fill="#fffef4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth=".77094"
            d="m72.096 69.764s1.3376 0.38247 2.1066 0.39196c0.76893 0.0095 2.44-0.39196 2.44-0.39196 0.39596-0.06361 0.72389 0.32286 0.72389 0.72389v4.3678c0 0.40104-0.52337 0.72389-0.72389 0.72389s-1.6592-0.41225-2.4288-0.40316c-0.76958 0.0091-2.1177 0.40316-2.1177 0.40316-0.39396 0.075-0.72389-0.32286-0.72389-0.72389v-4.3678c0-0.40104 0.32286-0.72389 0.72389-0.72389z"
          />
        </defs>

        {/* Pins */}
        <g
          transform="translate(-66.856 -41.367)"
          fill="#454837"
          fillOpacity=".49194"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth=".76744"
        >
          <rect x="73" y="87" width="2" height="6.5" rx=".7" ry=".7" />
          <rect x="82.6" y="87" width="2" height="6.5" rx=".7" ry=".7" />
          <rect x="92.2" y="87" width="2" height="6.5" rx=".7" ry=".7" />
          <rect x="101.8" y="87" width="2" height="6.5" rx=".7" ry=".7" />
          <rect x="111.4" y="87" width="2" height="6.5" rx=".7" ry=".7" />
          <rect x="121" y="87" width="2" height="6.5" rx=".7" ry=".7" />
          <rect x="130.6" y="87" width="2" height="6.5" rx=".7" ry=".7" />
          <rect x="140.2" y="87" width="2" height="6.5" rx=".7" ry=".7" />

          <rect x="73" y="44.4" width="2" height="6.5" rx=".7" ry=".7" />
          <rect x="82.6" y="44.4" width="2" height="6.5" rx=".7" ry=".7" />
          <rect x="92.2" y="44.4" width="2" height="6.5" rx=".7" ry=".7" />
          <rect x="101.8" y="44.4" width="2" height="6.5" rx=".7" ry=".7" />
          <rect x="111.4" y="44.4" width="2" height="6.5" rx=".7" ry=".7" />
          <rect x="121" y="44.4" width="2" height="6.5" rx=".7" ry=".7" />
          <rect x="130.6" y="44.4" width="2" height="6.5" rx=".7" ry=".7" />
          <rect x="140.2" y="44.4" width="2" height="6.5" rx=".7" ry=".7" />
        </g>

        {/* Board */}
        <rect x="0" y="8.5" width="90.5" height="38.0831" fill="#d72c2c" />

        {/* Text */}
        <text fill="#fffef4" fontFamily="sans-serif" fontSize="7.66px" style={{ lineHeight: 1.25 }}>
          <tspan x="6.340" y="18.03">
            ON
          </tspan>
          <tspan x="4.35" y="43.28">
            1
          </tspan>
          <tspan x="14.485" y="43.28">
            2
          </tspan>
          <tspan x="23.956" y="43.28">
            3
          </tspan>
          <tspan x="33.57" y="43.28">
            4
          </tspan>
          <tspan x="43.05" y="43.28">
            5
          </tspan>
          <tspan x="52.36" y="43.28">
            6
          </tspan>
          <tspan x="62.45" y="43.28">
            7
          </tspan>
          <tspan x="71.92" y="43.28">
            8
          </tspan>
        </text>

        {/* Switches */}
        <g fill="#917c6f" strokeWidth=".77094">
          {drawSwitch(0, 0)}
          {drawSwitch(1, 9.6)}
          {drawSwitch(2, 19.4)}
          {drawSwitch(3, 29.1)}
          {drawSwitch(4, 38.5)}
          {drawSwitch(5, 48.1)}
          {drawSwitch(6, 57.7)}
          {drawSwitch(7, 67.3)}
        </g>
      </svg>
    </div>
  );
}
