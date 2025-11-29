import { Position, Handle, NodeProps, BuiltInNode } from '@xyflow/react';
import { useState } from 'react';

export type BigSoundSensorNodeData = {
  label?: string;
  led1?: boolean;
  led2?: boolean;
  [key: string]: unknown;
};

export default function BigSoundSensorNode({ data, isConnectable }: NodeProps<BuiltInNode>) {
  const nodeData = data as BigSoundSensorNodeData;
  const [led1] = useState(nodeData.led1 || false);
  const [led2] = useState(nodeData.led2 || false);

  const pinInfo = [
    { name: 'AOUT', y: 11, x: 0, number: 1, position: Position.Left },
    { name: 'GND', y: 20.5, x: 0, number: 2, position: Position.Left },
    { name: 'VCC', y: 30.5, x: 0, number: 3, position: Position.Left },
    { name: 'DOUT', y: 40.5, x: 0, number: 4, position: Position.Left },
  ];

  return (
    <div style={{ position: 'relative' }}>
      {pinInfo.map((pin) => {
        const handleStyle = {
          position: 'absolute' as const,
          left: `${pin.x}px`,
          top: `${pin.y * 3.7795275591}px`,
          width: '4px',
          height: '4px',
          background: pin.name === 'GND' || pin.name === 'VCC' ? '#ff0072' : '#1a192b',
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
        width="37.056mm"
        height="13.346mm"
        clipRule="evenodd"
        fillRule="evenodd"
        version="1.1"
        viewBox="0 0 140 50.4"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <pattern id="pin-pattern" height="3.6" width="14" patternUnits="userSpaceOnUse">
            <path
              d="m5.09 1.3c0-0.618-0.502-1.12-1.12-1.12h-3.97v2.6h3.97c0.618 0 1.12-0.502 1.12-1.12z"
              fill="#eaecec"
            />
            <path
              d="m5.09 1.3c0-0.297-0.118-0.582-0.328-0.792-0.211-0.21-0.496-0.328-0.793-0.328h-1.14v2.6h1.14c0.297 0 0.582-0.118 0.793-0.328 0.21-0.21 0.328-0.495 0.328-0.793z"
              fill="#adafb0"
            />
          </pattern>
          <g id="header-pin">
            <path d="m3.4 1.8v-6.55h-6.55v6.55z" fill="#433b38" />
            <path
              d="m0 0c0.382 0 0.748-0.152 1.02-0.422 0.27-0.27 0.421-0.637 0.421-1.02s-0.151-0.748-0.421-1.02c-0.271-0.27-0.637-0.422-1.02-0.422h-26.1c-0.233 0-0.423 0.19-0.423 0.424v2.04c0 0.233 0.19 0.423 0.423 0.423h26.1z"
              fill="#9f9f9f"
            />
          </g>

          <filter id="ledFilter" x="-0.8" y="-0.8" height="5.2" width="5.8">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Board */}
        <path
          d="m133 0h-113v50.4h113zm-84.3 16.8c4.65 0 8.43 3.78 8.43 8.43 0 4.65-3.78 8.43-8.43 8.43s-8.43-3.78-8.43-8.43c0-4.65 3.78-8.43 8.43-8.43z"
          fill="#931917"
        />
        <path
          d="m48.8 13.9c6.24 0 11.3 5.07 11.3 11.3 0 6.24-5.07 11.3-11.3 11.3s-11.3-5.07-11.3-11.3c0-6.24 5.07-11.3 11.3-11.3zm0 2.88c4.65 0 8.43 3.78 8.43 8.43 0 4.65-3.78 8.43-8.43 8.43s-8.43-3.78-8.43-8.43c0-4.65 3.78-8.43 8.43-8.43z"
          fill="#d6d6d2"
        />

        {/* Chip */}
        <rect transform="translate(87,26)" width="5" height="14.5" fill="url(#pin-pattern)" />
        <rect transform="translate(74,40) rotate(180)" width="5" height="14.5" fill="url(#pin-pattern)" />
        <rect x="73.5" y="25.2" width="13.9" height="15.6" fill="#3b3838" />
        <path
          d="m88.7 40.9v3.24h-6.63c0-1.02-0.721-1.85-1.61-1.85s-1.61 0.827-1.61 1.85h-6.62v-3.24"
          fill="none"
          stroke="#fff"
          strokeWidth=".4px"
        />
        <path d="m72.2 25.2v-1.74h16.5v1.74" fill="none" stroke="#fff" strokeWidth=".4px" />

        {/* PCB pins */}
        <path d="m31 44.6v-38h-8.39v38z" fill="none" stroke="#fff" strokeWidth=".4px" />
        <use xlinkHref="#header-pin" x="26.6" y="12.4" />
        <use xlinkHref="#header-pin" x="26.6" y="22.1" />
        <use xlinkHref="#header-pin" x="26.6" y="31.9" />
        <use xlinkHref="#header-pin" x="26.6" y="41.6" />

        {/* Potentiometer */}
        <rect x="65.3" y="2.76" width="28.2" height="14.2" fill="#4875ce" />
        <path
          d="m94.9 2.1c0-0.221-0.179-0.4-0.4-0.4h-30.1c-0.221 0-0.4 0.179-0.4 0.4v15.5c0 0.221 0.179 0.4 0.4 0.4h30.1c0.221 0 0.4-0.179 0.4-0.4zm-0.4 0h-30.1v15.5h30.1z"
          fill="#fff"
        />
        <circle cx="69.9" cy="6.54" r="2.31" fill="#f1d99f" />
        <path
          d="m69.3 4.34c0.196-0.066 0.405-0.096 0.622-0.096 0.216 0 0.426 0.03 0.622 0.096v4.42c-0.196 0.066-0.406 0.096-0.622 0.096-0.217 0-0.426-0.03-0.622-0.096z"
          fill="#a4987a"
        />

        {/* LED2 */}
        <rect x="50.5" y="1.4" width="11.5" height="4.72" fill="#171514" stroke="#fff" strokeWidth=".4px" />
        <rect x="51.5" y="2.12" width="9.56" height="3.28" fill="#a19e9e" />
        <rect x="54.3" y="2.12" width="3.98" height="3.28" fill="#f1d99f" />
        {led2 && <circle cx="56" cy="4" r="5" fill="#80ff80" filter="url(#ledFilter)" />}

        {/* LED1 */}
        <rect x="50.5" y="44.4" width="11.5" height="4.72" fill="#171514" stroke="#fff" strokeWidth=".4px" />
        <rect x="51.5" y="45.1" width="9.56" height="3.28" fill="#a19e9e" />
        <rect x="54.3" y="45.1" width="3.98" height="3.28" fill="#f1d99f" />
        {led1 && <circle cx="56" cy="47" r="5" fill="#80ff80" filter="url(#ledFilter)" />}

        {/* Resistors */}
        <rect x="32.3" y="1.4" width="11.4" height="4.72" fill="#171514" stroke="#fff" strokeWidth=".4px" />
        <rect x="33.2" y="2.12" width="9.56" height="3.28" fill="#a19e9e" />
        <rect x="36" y="2.52" width="3.97" height="2.47" fill="#171514" />
        <rect x="97.1" y="1.92" width="11.4" height="4.72" fill="#171514" stroke="#fff" strokeWidth=".4px" />
        <rect x="98.1" y="2.64" width="9.56" height="3.28" fill="#a19e9e" />
        <rect x="101" y="3.05" width="3.97" height="2.47" fill="#171514" />
        <rect x="97.1" y="43.9" width="11.4" height="4.72" fill="#171514" stroke="#fff" strokeWidth=".4px" />
        <rect x="98.1" y="44.6" width="9.56" height="3.28" fill="#a19e9e" />
        <rect x="101" y="45" width="3.97" height="2.47" fill="#171514" />
        <rect x="97.1" y="9" width="11.4" height="4.72" fill="#171514" stroke="#fff" strokeWidth=".4px" />
        <rect x="98.1" y="9.72" width="9.56" height="3.28" fill="#a19e9e" />
        <rect x="101" y="10.1" width="3.97" height="2.47" fill="#171514" />
        <rect x="97.1" y="36.8" width="11.4" height="4.72" fill="#171514" stroke="#fff" strokeWidth=".4px" />
        <rect x="98.1" y="37.6" width="9.56" height="3.28" fill="#a19e9e" />
        <rect x="101" y="38" width="3.97" height="2.47" fill="#171514" />
        <rect x="32.3" y="44.4" width="11.4" height="4.72" fill="#171514" stroke="#fff" strokeWidth=".4px" />
        <rect x="33.2" y="45.1" width="9.56" height="3.28" fill="#a19e9e" />
        <rect x="36" y="45.5" width="3.97" height="2.47" fill="#171514" />

        {/* Texts */}
        <text fill="#ffffff" fontFamily="sans-serif" fontSize="3.72px">
          <tspan x="33.049" y="12.085">
            AO
          </tspan>
          <tspan x="33.049" y="41.951">
            DO
          </tspan>
          <tspan x="33.049" y="22.067">
            G
          </tspan>
          <tspan x="32.964001" y="32.418999" fontSize="5.25px">
            +
          </tspan>
        </text>

        <text
          transform="rotate(90 92.4 -43.2)"
          fill="#ffffff"
          fontFamily="sans-serif"
          fontSize="3.72px"
          x="137.13"
          y="3.60"
        >
          L2
        </text>

        <text
          transform="rotate(90 92.4 -.394)"
          fill="#ffffff"
          fontFamily="sans-serif"
          fontSize="3.72px"
          x="137.13"
          y="46.38"
        >
          L1
        </text>

        {/* Microphone */}
        <path
          d="m110 24.7c0-1.29-1.05-2.34-2.34-2.34h-1e-3c-1.29 0-2.34 1.05-2.34 2.34v0.989c0 1.3 1.05 2.34 2.34 2.34h1e-3c1.29 0 2.34-1.05 2.34-2.34v-0.989z"
          fill="#f8f3e9"
        />
        <circle cx="108" cy="25.2" r="1.14" fill="#3b3838" />
        <path
          d="m115 6.29c1.29 0 2.34-1.05 2.34-2.34v-1e-3c0-1.29-1.05-2.34-2.34-2.34h-0.99c-1.29 0-2.34 1.05-2.34 2.34v1e-3c0 1.29 1.05 2.34 2.34 2.34h0.99z"
          fill="#f8f3e9"
        />
        <path
          d="m116 3.95c0 0.631-0.513 1.14-1.14 1.14s-1.14-0.512-1.14-1.14c0-0.632 0.512-1.14 1.14-1.14s1.14 0.512 1.14 1.14z"
          fill="#3b3838"
        />
        <path
          d="m118 27.8c0-0.622-0.247-1.22-0.686-1.66-0.44-0.44-1.04-0.687-1.66-0.687-0.621 0-1.22 0.247-1.66 0.687-0.44 0.439-0.687 1.04-0.687 1.66v3.03c0 0.622 0.247 1.22 0.687 1.66 0.439 0.439 1.04 0.686 1.66 0.686 0.622 0 1.22-0.247 1.66-0.686 0.439-0.44 0.686-1.04 0.686-1.66z"
          fill="#f8f3e9"
        />
        <circle cx="115" cy="29.3" r="1.14" fill="#3b3838" />
        <path
          d="m129 47.7c0.621 0 1.22-0.247 1.66-0.686 0.439-0.44 0.686-1.04 0.686-1.66 0-0.621-0.247-1.22-0.686-1.66-0.44-0.44-1.04-0.687-1.66-0.687h-3.03c-0.621 0-1.22 0.247-1.66 0.687-0.44 0.439-0.687 1.04-0.687 1.66 0 0.622 0.247 1.22 0.687 1.66 0.439 0.439 1.04 0.686 1.66 0.686z"
          fill="#f8f3e9"
        />
        <path
          d="m128 45.4c0 0.631-0.513 1.14-1.14 1.14s-1.14-0.513-1.14-1.14 0.512-1.14 1.14-1.14 1.14 0.512 1.14 1.14z"
          fill="#3b3838"
        />
        <path
          d="m129 6.29c0.621 0 1.22-0.247 1.66-0.687 0.439-0.439 0.686-1.04 0.686-1.66v-1e-3c0-0.621-0.247-1.22-0.686-1.66-0.44-0.439-1.04-0.686-1.66-0.686h-3.03c-0.621 0-1.22 0.247-1.66 0.686-0.44 0.44-0.687 1.04-0.687 1.66v1e-3c0 0.621 0.247 1.22 0.687 1.66 0.439 0.44 1.04 0.687 1.66 0.687z"
          fill="#f8f3e9"
        />
        <path
          d="m128 3.95c0 0.631-0.513 1.14-1.14 1.14s-1.14-0.512-1.14-1.14c0-0.632 0.512-1.14 1.14-1.14s1.14 0.512 1.14 1.14z"
          fill="#3b3838"
        />
        <path
          d="m117 41.4c0.621 0 1.22-0.247 1.66-0.686 0.439-0.44 0.686-1.04 0.686-1.66s-0.247-1.22-0.686-1.66c-0.44-0.44-1.04-0.687-1.66-0.687h-3.03c-0.621 0-1.22 0.247-1.66 0.687-0.44 0.439-0.687 1.04-0.687 1.66s0.247 1.22 0.687 1.66c0.439 0.439 1.04 0.686 1.66 0.686z"
          fill="#f8f3e9"
        />
        <path
          d="m114 39.1c0 0.631-0.512 1.14-1.14 1.14-0.631 0-1.14-0.513-1.14-1.14s0.512-1.14 1.14-1.14c0.632 0 1.14 0.512 1.14 1.14z"
          fill="#3b3838"
        />
        <path
          d="m117 9.6c0.621 0 1.22 0.247 1.66 0.686 0.439 0.44 0.686 1.04 0.686 1.66 0 0.621-0.247 1.22-0.686 1.66-0.44 0.44-1.04 0.687-1.66 0.687h-3.03c-0.621 0-1.22-0.247-1.66-0.687-0.44-0.439-0.687-1.04-0.687-1.66 0-0.622 0.247-1.22 0.687-1.66 0.439-0.439 1.04-0.686 1.66-0.686z"
          fill="#f8f3e9"
        />
        <path
          d="m114 11.9c0-0.631-0.512-1.14-1.14-1.14-0.631 0-1.14 0.513-1.14 1.14s0.512 1.14 1.14 1.14c0.632 0 1.14-0.512 1.14-1.14z"
          fill="#3b3838"
        />
        <path
          d="m118 19.2c0-0.621-0.247-1.22-0.686-1.66-0.44-0.44-1.04-0.687-1.66-0.687-0.621 0-1.22 0.247-1.66 0.687-0.44 0.439-0.687 1.04-0.687 1.66v3.03c0 0.621 0.247 1.22 0.687 1.66 0.439 0.439 1.04 0.686 1.66 0.686 0.622 0 1.22-0.247 1.66-0.686 0.439-0.44 0.686-1.04 0.686-1.66z"
          fill="#f8f3e9"
        />
        <circle cx="115" cy="20.7" r="1.14" fill="#3b3838" />
        <path
          d="m139 9.6h-16.2c-0.391 0-0.766 0.155-1.04 0.431-0.277 0.277-0.432 0.652-0.432 1.04v28.8c0 0.391 0.155 0.766 0.432 1.04 0.276 0.277 0.651 0.432 1.04 0.432h16.2z"
          fill="#e1e0da"
        />
        <rect x="139" y="9.6" width="1.55" height="31.8" fill="#3b3838" />
        <path
          d="m121 29.3 17.7-3.26v-16.5h-16.2c-0.391 0-0.766 0.155-1.04 0.431-0.277 0.277-0.432 0.652-0.432 1.04z"
          fill="#f3f0f4"
        />
        <path
          d="m121 28.5h-4.93c-0.21 0-0.411 0.083-0.56 0.232-0.148 0.148-0.231 0.349-0.231 0.559v0.022c0 0.21 0.083 0.411 0.231 0.559 0.149 0.149 0.35 0.232 0.56 0.232h4.93z"
          fill="#afafaf"
        />
        <path
          d="m121 20h-4.93c-0.21 0-0.411 0.084-0.56 0.232-0.148 0.148-0.231 0.35-0.231 0.559v0.022c0 0.21 0.083 0.411 0.231 0.559 0.149 0.149 0.35 0.232 0.56 0.232h4.93z"
          fill="#afafaf"
        />
        <path
          d="m115 6.29c1.29 0 2.34-1.05 2.34-2.34v-1e-3c0-1.29-1.05-2.34-2.34-2.34h-0.99c-1.29 0-2.34 1.05-2.34 2.34v1e-3c0 1.29 1.05 2.34 2.34 2.34h0.99z"
          fill="#f8f3e9"
        />
        <path
          d="m116 3.95c0 0.631-0.513 1.14-1.14 1.14s-1.14-0.512-1.14-1.14c0-0.632 0.512-1.14 1.14-1.14s1.14 0.512 1.14 1.14z"
          fill="#3b3838"
        />
      </svg>
    </div>
  );
}
