import { Position, Handle, NodeProps, BuiltInNode } from '@xyflow/react';
import { useState } from 'react';

export type GasSensorNodeData = {
  label?: string;
  ledPower?: boolean;
  ledD0?: boolean;
  [key: string]: unknown;
};

export default function GasSensorNode({ data, isConnectable }: NodeProps<BuiltInNode>) {
  const nodeData = data as GasSensorNodeData;
  const [ledPower] = useState(nodeData.ledPower || false);
  const [ledD0] = useState(nodeData.ledD0 || false);

  const pinInfo = [
    { name: 'AOUT', y: 16.5, x: 137, number: 1, isPower: false, position: Position.Right },
    { name: 'DOUT', y: 26.4, x: 137, number: 2, isPower: false, position: Position.Right },
    { name: 'GND', y: 36.5, x: 137, number: 3, isPower: true, position: Position.Right },
    { name: 'VCC', y: 46.2, x: 137, number: 4, isPower: true, position: Position.Right },
  ];

  return (
    <div style={{ position: 'relative' }}>
      {pinInfo.map((pin) => {
        const handleStyle = {
          position: 'absolute' as const,
          left: `${pin.x - 7}px`,
          top: `${pin.y}px`,
          width: '4px',
          height: '4px',
          background: pin.isPower ? '#ff0072' : '#1a192b',
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
        width="36.232mm"
        height="16.617mm"
        fillRule="evenodd"
        version="1.1"
        viewBox="0 0 137 59.5"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <pattern id="a" width="4.1" height="4.1" patternUnits="userSpaceOnUse">
            <path
              d="m0 0v4.09h0.4v-0.85l0.42 0.381v0.469h0.4v-0.0996l0.109 0.0996h0.711v-0.799l0.42 0.379v0.42h0.398v-0.0488l0.0547 0.0488h0.766v-0.75l0.42 0.381v0.369h0.4v-4.09h-0.4v0.311l-0.334-0.311h-0.598l0.111 0.0996v0.9l-0.42-0.379v-0.621h-0.398v0.25l-0.277-0.25h-0.6l0.0566 0.0508v0.9l-0.42-0.381v-0.57h-0.4v0.201l-0.223-0.201zm0.4 0.359 0.42 0.381v0.9l-0.42-0.381zm1.64 0.0508 0.42 0.391v0.889l-0.42-0.379zm1.64 0.0605 0.42 0.379v0.891l-0.42-0.381zm-2.46 0.639 0.42 0.381v0.9l-0.42-0.381zm1.64 0.0508 0.42 0.381v0.898l-0.42-0.379zm-2.46 0.641 0.42 0.379v0.9l-0.42-0.379zm1.64 0.0488 0.42 0.381v0.9l-0.42-0.381zm1.64 0.0508 0.42 0.379v0.9l-0.42-0.379zm-2.46 0.65 0.42 0.379v0.9l-0.42-0.379zm1.64 0.0488 0.42 0.381v0.9l-0.42-0.381z"
              fill="#949392"
            />
          </pattern>
          <g id="pin">
            <path
              fill="#c6bf95"
              d="m29 4.6c0.382 0 0.748-0.152 1.02-0.422s0.422-0.636 0.422-1.02v-1e-3c0-0.382-0.152-0.748-0.422-1.02s-0.636-0.422-1.02-0.422h-26.1c-0.234 0-0.423 0.189-0.423 0.423v2.04c0 0.234 0.189 0.423 0.423 0.423h26.1z"
            />
            <rect x="0" y="0" width="6.9" height="6.9" />
          </g>
          <filter id="ledFilter" x="-0.8" y="-0.8" height="5.2" width="5.8">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Board */}
        <path
          d="m113 0h-113v59.5h113zm-1.6 53.2c0 2.62-2.12 4.74-4.74 4.74s-4.74-2.12-4.74-4.74c0-2.62 2.12-4.74 4.74-4.74s4.74 2.12 4.74 4.74zm-110 0c0 2.62 2.12 4.74 4.74 4.74 2.62 0 4.74-2.12 4.74-4.74 0-2.62-2.12-4.74-4.74-4.74-2.62 0-4.74 2.12-4.74 4.74zm105-51.6c2.62 0 4.74 2.12 4.74 4.74 0 2.62-2.12 4.74-4.74 4.74s-4.74-2.12-4.74-4.74c0-2.62 2.12-4.74 4.74-4.74zm-101 0c-2.62 0-4.74 2.12-4.74 4.74 0 2.62 2.12 4.74 4.74 4.74 2.62 0 4.74-2.12 4.74-4.74 0-2.62-2.12-4.74-4.74-4.74z"
          fill="#0664af"
        />

        {/* Pins */}
        <use xlinkHref="#pin" x="107" y="12" />
        <use xlinkHref="#pin" x="107" y="21.3" />
        <use xlinkHref="#pin" x="107" y="31.1" />
        <use xlinkHref="#pin" x="107" y="40.9" />

        {/* Sensor */}
        <circle cx="47.7" cy="29.8" r="31.2" fill="none" stroke="#fff" strokeWidth=".4px" />
        <circle cx="47.7" cy="29.8" r="28.8" fill="#dedede" />
        <circle cx="47.7" cy="29.8" r="25.8" fill="#d0ccc4" />
        <circle cx="47.7" cy="29.8" r="21.4" fill="#bab3ad" />
        <circle cx="47.7" cy="29.8" r="21.4" fill="url(#a)" />

        <text fill="#ffffff" fontFamily="sans-serif" fontSize="3.72px">
          <tspan x="94.656" y="16.729">
            AOUT
          </tspan>
          <tspan x="94.656" y="26.098">
            DOUT
          </tspan>
          <tspan x="94.656" y="35.911">
            GND
          </tspan>
          <tspan x="94.656" y="45.696">
            VCC
          </tspan>
        </text>

        {/* LEDs */}
        <rect
          style={{ opacity: 1, fill: '#999999', strokeWidth: 1.5747, paintOrder: 'stroke markers fill' }}
          width="8.5262499"
          height="3.8281121"
          x="81.321793"
          y="5.8179226"
        />
        <rect
          style={{ opacity: 1, fill: '#e6e6e6', strokeWidth: 2.05589, paintOrder: 'stroke markers fill' }}
          width="4.8444595"
          height="3.8281121"
          x="83.162689"
          y="5.8179226"
        />
        {ledPower && <circle cx="85.5" cy="8" r="1.8" fill="#03f704" filter="url(#ledFilter)" />}
        <rect
          style={{ fill: '#999999', strokeWidth: 1.5747, paintOrder: 'stroke markers fill' }}
          width="8.5262499"
          height="3.8281121"
          x="81.018036"
          y="48.700188"
        />
        <rect
          style={{ fill: '#e6e6e6', strokeWidth: 2.05589, paintOrder: 'stroke markers fill' }}
          width="4.8444595"
          height="3.8281121"
          x="82.858932"
          y="48.700188"
        />
        {ledD0 && <circle cx="85" cy="50" r="1.8" fill="#03f704" filter="url(#ledFilter)" />}
        <text fill="#ffffff" fontFamily="sans-serif" fontSize="3px">
          <tspan x="80.213432" y="4.7265162">
            PWR LED
          </tspan>
          <tspan x="80.463821" y="55.852409">
            D0 LED
          </tspan>
        </text>
      </svg>
    </div>
  );
}
