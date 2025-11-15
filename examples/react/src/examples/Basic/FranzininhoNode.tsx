import { Position, Handle, NodeProps, BuiltInNode } from '@xyflow/react';
import { useState } from 'react';

export type FranzininhoNodeData = {
  label?: string;
  led1?: boolean;
  ledPower?: boolean;
  resetPressed?: boolean;
  [key: string]: unknown;
};

export default function FranzininhoNode({ data, isConnectable }: NodeProps<BuiltInNode>) {
  const nodeData = data as FranzininhoNodeData;
  const [led1] = useState(nodeData.led1 || false);
  const [ledPower] = useState(nodeData.ledPower || false);
  const [resetPressed, setResetPressed] = useState(nodeData.resetPressed || false);

  const pinInfo = [
    { name: 'GND.1', x: 218.5, y: 23.3, isPower: true, position: Position.Right },
    { name: 'VCC.1', x: 218.5, y: 32.9, isPower: true, position: Position.Right },
    { name: 'PB4', x: 218.5, y: 42.5, isPower: false, position: Position.Right },
    { name: 'PB5', x: 218.5, y: 52.2, isPower: false, position: Position.Right },
    { name: 'PB3', x: 218.5, y: 61.7, isPower: false, position: Position.Right },
    { name: 'PB2', x: 218.5, y: 71.2, isPower: false, position: Position.Right },
    { name: 'PB1', x: 218.5, y: 80.9, isPower: false, position: Position.Right },
    { name: 'PB0', x: 218.5, y: 90.5, isPower: false, position: Position.Right },
    { name: 'VIN', x: 132.7, y: 8.1, isPower: true, position: Position.Top },
    { name: 'GND.2', x: 142.9, y: 8.1, isPower: true, position: Position.Top },
    { name: 'VCC.2', x: 153, y: 8.1, isPower: true, position: Position.Top },
  ];

  const handleDown = () => {
    setResetPressed(true);
  };

  const handleUp = () => {
    setResetPressed(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      {pinInfo.map((pin) => {
        const isTopPin = pin.position === Position.Top;
        const handleStyle = {
          position: 'absolute' as const,
          left: isTopPin ? `${pin.x}px` : `${pin.x - 7}px`,
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
        width="64mm"
        height="30mm"
        version="1.1"
        viewBox="0 0 64 30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="ledFilter" x="-0.8" y="-0.8" height="2.8" width="2.8">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
          <pattern id="pins-female" height="2.54" width="2.54" patternUnits="userSpaceOnUse">
            <path d="M1.27 0v2.54" stroke="#8c8663" strokeWidth=".4" />
            <circle cx="1.27" cy="1.27" r=".9" fill="#8c8663" />
          </pattern>
        </defs>

        {/* PCB */}
        <path
          d="M63.1 0H12.5v30h50.6V0zM22.2 25.9a1.57 1.57 0 11-.002 3.142A1.57 1.57 0 0122.2 25.9zm38.4 0a1.57 1.57 0 11-.002 3.138A1.57 1.57 0 0160.6 25.9zM22.2 1a1.57 1.57 0 110 3.14 1.57 1.57 0 010-3.14zm38.4 0a1.57 1.57 0 11-.002 3.142A1.57 1.57 0 0160.6 1z"
          fill="#2c8240"
        />

        {/* USB Connector */}
        <g fill="#b2b2b2">
          <path d="M15.6 11h1.02v1.53H15.6zM16.6 11.5h1.38v.45H16.6z" />
          <path d="M15.6 13.2h1.02v1.53H15.6zM16.6 13.7h1.38v.45H16.6z" />
          <path d="M15.6 15.3h1.02v1.53H15.6zM16.6 15.9h1.38v.45H16.6z" />
          <path d="M15.6 17.5h1.02v1.53H15.6zM16.6 18.1h1.38v.45H16.6z" />
        </g>

        <path d="M-.145 9.97h15.8v10.1h-15.8z" fill="#999" />
        <path d="M-.147 9.97h15v9.24h-15z" fill="#ccc" />

        {/* Pin Headers */}
        <g transform="translate(59.1 4.7) rotate(90 0 0)">
          <rect width="20.7" height="2.54" fill="url(#pins-female)" />
        </g>

        {/* Pin Labels */}
        <text fill="#fff" fontSize="2px" fontFamily="monospace">
          <tspan x="59.5" y="6.54">
            GND
          </tspan>
          <tspan x="59.5" y="9.08">
            VCC
          </tspan>
          <tspan x="60.5" y="11.62">
            5
          </tspan>
          <tspan x="60.5" y="14.16">
            4
          </tspan>
          <tspan x="60.5" y="16.7">
            3
          </tspan>
          <tspan x="60.5" y="19.24">
            2
          </tspan>
          <tspan x="60.5" y="21.78">
            1
          </tspan>
          <tspan x="60.5" y="24.32">
            0
          </tspan>
        </text>

        {/* Top Pin Bar */}
        <g fill="#8c8663">
          <path d="M40.1 1.7h.863v.864H40.1z" />
          <path d="M37.4 1.7h.863v.864H37.4z" />
          <path d="M34.7 1.7h.863v.864H34.7z" />
        </g>

        <text
          transform="translate(33.1 6) rotate(270 0 0)"
          fill="#fff"
          fontSize="1.4px"
          fontFamily="monospace"
        >
          <tspan x="0" y="2.5">
            VIN
          </tspan>
          <tspan x="0" y="5">
            GND
          </tspan>
          <tspan x="0" y="7.5">
            VCC
          </tspan>
        </text>

        {/* MCU */}
        <path
          d="M52.6 17.7h1.22v.873H52.6zM50.2 17.7h1.22v.873H50.2zM47.8 17.7h1.22v.873H47.8zM45.3 17.7h1.22v.873H45.3zM45.3 10.6h1.22v.858H45.3zM47.8 10.6h1.22v.858H47.8zM50.2 10.6h1.22v.858H50.2zM52.6 10.6h1.22v.858H52.6z"
          fill="#b2b2b2"
        />
        <path d="M44.7 11.5h9.77v6.28H44.7z" fill="#313131" />

        <text
          x="45.14"
          y="13.4"
          fill="olive"
          fontFamily="sans-serif"
          fontSize="1.6px"
        >
          ATTINY85
        </text>

        {/* Power LED */}
        <g fill="#00d300">
          <circle cx="33.6" cy="25.9" r="1.6" fillOpacity=".64" />
          <circle cx="33.6" cy="25.9" r="1.2" fillOpacity=".92" />
        </g>
        {ledPower && <circle cx="33.6" cy="25.9" r="1.8" fill="#03f704" filter="url(#ledFilter)" />}

        {/* LED1 */}
        <g fill="#d8e208">
          <circle cx="38.35" cy="25.9" r="1.6" fillOpacity=".64" />
          <circle cx="38.35" cy="25.9" r="1.2" fillOpacity=".92" />
        </g>
        {led1 && <circle cx="38.35" cy="25.9" r="1.8" fill="#fcfd00" filter="url(#ledFilter)" />}

        <g fill="#fff">
          <text x="32.5" y="23.4" fontSize="2px">
            ON
          </text>
          <text x="36.3" y="23.4" fontSize="2px">
            LED1
          </text>
        </g>

        {/* Reset Button */}
        <path
          d="M52.5 2.16a.535.535 0 00-.534-.535h-4.49a.535.535 0 00-.534.535v4.28c0 .295.239.535.534.535h4.49c.295 0 .534-.24.534-.535V2.16z"
          fill="#999"
        />

        <circle
          cx="49.7"
          cy="4.3"
          r="1.4"
          fill="#000"
          stroke={resetPressed ? '#333' : '#3f3f3f'}
          strokeWidth=".1"
          onMouseDown={handleDown}
          onMouseUp={handleUp}
          onMouseLeave={handleUp}
          style={{ cursor: 'pointer' }}
        />

        {/* Logo */}
        <g fill="#fff">
          <path d="M55.5 25.1h-3.54v2.42h3.54V25.1zm-.174.174v2.07h-3.19v-2.07h3.19z" />
          <path d="M56 23.6a.514.514 0 00-.514-.514h-14a.514.514 0 00-.514.514v1.03c0 .283.23.514.514.514h14A.515.515 0 0056 24.63V23.6z" />
        </g>
        <text
          x="41.14"
          y="24.9"
          fill="#2c8240"
          fontFamily="sans-serif"
          fontWeight="bold"
          fontSize="2.15px"
        >
          FRANZININHO
        </text>
        <text
          x="52.2"
          y="26.95"
          fill="#fff"
          fontFamily="sans-serif"
          fontWeight="bold"
          fontSize="1.78px"
        >
          DIY
        </text>
      </svg>
    </div>
  );
}
