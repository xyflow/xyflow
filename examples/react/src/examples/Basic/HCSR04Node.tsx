import { Position, Handle, NodeProps, BuiltInNode } from '@xyflow/react';

export type HCSR04NodeData = {
  label?: string;
  [key: string]: unknown;
};

export default function HCSR04Node({ data, isConnectable }: NodeProps<BuiltInNode>) {
  const nodeData = data as HCSR04NodeData;

  const pinInfo = [
    { name: 'VCC', x: 71.3, y: 94.5, isPower: true, position: Position.Bottom },
    { name: 'TRIG', x: 81.3, y: 94.5, isPower: false, position: Position.Bottom },
    { name: 'ECHO', x: 91.3, y: 94.5, isPower: false, position: Position.Bottom },
    { name: 'GND', x: 101.3, y: 94.5, isPower: true, position: Position.Bottom },
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
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 45 25"
        height="25mm"
        width="45mm"
        fontFamily="monospace"
      >
        <defs>
          <pattern patternUnits="userSpaceOnUse" width="2" height="2" id="checkerboard">
            <path d="M0 0h1v1H0zM1 1h1v1H1z" />
          </pattern>
          <radialGradient id="grad1" cx="8.96" cy="10.04" r="3.58" gradientUnits="userSpaceOnUse">
            <stop stopColor="#777" offset="0" />
            <stop stopColor="#b9b9b9" offset="1" />
          </radialGradient>
          <g id="sensor-unit">
            <circle cx="8.98" cy="10" r="8.61" fill="#dcdcdc" />
            <circle cx="8.98" cy="10" r="7.17" fill="#222" />
            <circle cx="8.98" cy="10" r="5.53" fill="#777" fillOpacity=".992" />
            <circle cx="8.98" cy="10" r="3.59" fill="url(#grad1)" />
            <circle cx="8.99" cy="10" r=".277" fill="#777" fillOpacity=".818" />
            <circle cx="8.98" cy="10" r="5.53" fill="url(#checkerboard)" opacity=".397" />
          </g>
        </defs>
        <path
          d="M0 0v20.948h45V0zm1.422.464a1 1 0 01.004 0 1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 01.996-1zm41.956 0a1 1 0 01.004 0 1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 01.996-1zM1.422 18.484a1 1 0 01.004 0 1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 01.996-1zm41.956 0a1 1 0 01.004 0 1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 01.996-1z"
          fill="#456f93"
        />
        <path
          d="M15.293 5.888l2.934-2.934v3.124l2.944 2.943v10.143M23.269 19.037v-2.473l-.966-.965v-12.5l2.577 1.488 4.741 4.741"
          fill="none"
          stroke="#355a7c"
          strokeWidth=".858"
        />
        <use xlinkHref="#sensor-unit" />
        <use xlinkHref="#sensor-unit" x="27.12" />
        <g fill="none" stroke="#505132" strokeWidth=".368">
          <circle cx="43.4" cy="1.46" r="1" />
          <circle cx="43.4" cy="19.5" r="1" />
          <circle cx="1.43" cy="1.46" r="1" />
          <circle cx="1.43" cy="19.5" r="1" />
        </g>
        <rect
          ry="2.07"
          y=".626"
          x="17.111"
          height="4.139"
          width="10.272"
          fill="#878787"
          stroke="#424242"
          strokeWidth=".368"
        />
        <g fill="black">
          <rect x="17.87" y="18" ry=".568" width="2.25" height="2.271" />
          <rect x="20.41" y="18" ry=".568" width="2.25" height="2.271" />
          <rect x="22.95" y="18" ry=".568" width="2.25" height="2.271" />
          <rect x="25.49" y="18" ry=".568" width="2.25" height="2.271" />
        </g>
        <g fill="#ccc" strokeLinecap="round" strokeWidth=".21">
          <rect x="18.61" y="19" width=".75" height="7" rx=".2" />
          <rect x="21.15" y="19" width=".75" height="7" rx=".2" />
          <rect x="23.69" y="19" width=".75" height="7" rx=".2" />
          <rect x="26.23" y="19" width=".75" height="7" rx=".2" />
        </g>
        <text fontWeight="400" fontSize="2.2" fill="#e6e6e6" strokeWidth=".055">
          <tspan y="8" x="17.6">
            HC-SR04
          </tspan>
        </text>
        <text transform="rotate(-90)" fontWeight="400" fontSize="1.55" fill="#e6e6e6" strokeWidth=".039">
          <tspan x="-17.591" y="19.561">
            VCC
          </tspan>
          <tspan x="-17.591" y="22.101">
            TRIG
          </tspan>
          <tspan x="-17.591" y="24.641">
            ECHO
          </tspan>
          <tspan x="-17.591" y="27.181">
            GND
          </tspan>
        </text>
      </svg>
    </div>
  );
}
