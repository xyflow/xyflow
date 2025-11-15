import { memo, useState } from 'react';
import { Handle, Position, NodeProps, BuiltInNode } from '@xyflow/react';

const RGBLedNode = memo(({ data }: NodeProps<BuiltInNode>) => {
  const [ledRed, setLedRed] = useState((data.ledRed as number) || 0);
  const [ledGreen, setLedGreen] = useState((data.ledGreen as number) || 0);
  const [ledBlue, setLedBlue] = useState((data.ledBlue as number) || 0);

  const pinInfo = [
    { name: 'R', x: 8.5, y: 44 },
    { name: 'COM', x: 18, y: 54 },
    { name: 'G', x: 26.4, y: 44 },
    { name: 'B', x: 35.7, y: 44 },
  ];

  const brightness = Math.max(ledRed, ledGreen, ledBlue);
  const opacity = brightness ? 0.2 + brightness * 0.6 : 0;

  return (
    <div
      style={{
        background: 'transparent',
        position: 'relative',
        width: '42.129px',
      }}
    >
      <svg
        width="42.129"
        height="72.582"
        viewBox="-17 -10 37.3425 57.5115"
      >
        {/* LED Legs */}
        <g fill="none" stroke="#9D9999" strokeLinecap="round" strokeWidth="1.5px">
          <path d="m4.1 15.334 3.0611 9.971" />
          <path d="m8 14.4 5.9987 4.0518 1.1777 6.5679" strokeLinejoin="round" />
          <path d="m-4.3 14.184-5.0755 5.6592-0.10206 6.1694" strokeLinejoin="round" />
          <path d="m-1.1 15.607-0.33725 18.4" />
        </g>

        {/* LED Body */}
        <path
          d="m8.3435 5.65v-5.9126c0-3.9132-3.168-7.0884-7.0855-7.0884-3.9125 0-7.0877 3.1694-7.0877 7.0884v13.649c1.4738 1.651 4.0968 2.7526 7.0877 2.7526 4.6195 0 8.3686-2.6179 8.3686-5.8594v-1.5235c-7.4e-4 -1.1426-0.47444-2.2039-1.283-3.1061z"
          opacity="0.3"
        />
        <path
          d="m8.3435 5.65v-5.9126c0-3.9132-3.168-7.0884-7.0855-7.0884-3.9125 0-7.0877 3.1694-7.0877 7.0884v13.649c1.4738 1.651 4.0968 2.7526 7.0877 2.7526 4.6195 0 8.3686-2.6179 8.3686-5.8594v-1.5235c-7.4e-4 -1.1426-0.47444-2.2039-1.283-3.1061z"
          fill="#e6e6e6"
          opacity="0.5"
        />
        <path
          d="m8.3435 5.65v3.1054c0 2.7389-3.1658 4.9651-7.0855 4.9651-3.9125 2e-5 -7.0877-2.219-7.0877-4.9651v4.6296c1.4738 1.6517 4.0968 2.7526 7.0877 2.7526 4.6195 0 8.3686-2.6179 8.3686-5.8586l-4e-5 -1.5235c-7e-4 -1.1419-0.4744-2.2032-1.283-3.1054z"
          fill="#d1d1d1"
          opacity="0.9"
        />
        <g transform="translate(-5.8295 -7.351)">
          <path
            d="m14.173 13.001v3.1054c0 2.7389-3.1658 4.9651-7.0855 4.9651-3.9125 2e-5 -7.0877-2.219-7.0877-4.9651v4.6296c1.4738 1.6517 4.0968 2.7526 7.0877 2.7526 4.6195 0 8.3686-2.6179 8.3686-5.8586l-4e-5 -1.5235c-7e-4 -1.1419-0.4744-2.2032-1.283-3.1054z"
            opacity="0.7"
          />
          <path
            d="m14.173 13.001v3.1054c0 2.7389-3.1658 4.9651-7.0855 4.9651-3.9125 2e-5 -7.0877-2.219-7.0877-4.9651v3.1054c1.4738 1.6502 4.0968 2.7526 7.0877 2.7526 4.6195 0 8.3686-2.6179 8.3686-5.8586-7.4e-4 -1.1412-0.47444-2.2025-1.283-3.1047z"
            opacity="0.25"
          />
          <ellipse cx="7.0877" cy="16.106" rx="7.087" ry="4.9608" opacity="0.25" />
        </g>
        <polygon
          transform="translate(-5.8295 -7.351)"
          points="3.1961 13.095 6.0156 13.095 10.012 8.8049 3.407 8.8049 2.2032 9.648 2.2032 16.107 3.1961 16.107"
          fill="#666"
        />
        <polygon
          transform="translate(-5.8295 -7.351)"
          points="11.06 13.095 11.06 16.107 11.974 16.107 11.974 8.5241 10.778 8.5241 11.215 9.0338 7.4117 13.095"
          fill="#666"
        />
        <path
          d="m8.3435 5.65v-5.9126c0-3.9132-3.168-7.0884-7.0855-7.0884-3.9125 0-7.0877 3.1694-7.0877 7.0884v13.649c1.4738 1.651 4.0968 2.7526 7.0877 2.7526 4.6195 0 8.3686-2.6179 8.3686-5.8594v-1.5235c-7.4e-4 -1.1426-0.47444-2.2039-1.283-3.1061z"
          fill="white"
          opacity="0.65"
        />
        <g transform="translate(-5.8295 -7.351)" fill="#fff">
          <path
            d="m10.388 3.7541 1.4364-0.2736c-0.84168-1.1318-2.0822-1.9577-3.5417-2.2385l0.25416 1.0807c0.76388 0.27072 1.4068 0.78048 1.8511 1.4314z"
            opacity="0.5"
          />
          <path
            d="m0.76824 19.926v1.5199c0.64872 0.5292 1.4335 0.97632 2.3076 1.3169v-1.525c-0.8784-0.33624-1.6567-0.78194-2.3076-1.3118z"
            opacity="0.5"
          />
          <path
            d="m11.073 20.21c-0.2556 0.1224-0.52992 0.22968-0.80568 0.32976-0.05832 0.01944-0.11736 0.04032-0.17784 0.05832-0.56376 0.17928-1.1614 0.31896-1.795 0.39456-0.07488 0.0094-0.1512 0.01872-0.22464 0.01944-0.3204 0.03024-0.64368 0.05832-0.97056 0.05832-0.14832 0-0.30744-0.01512-0.4716-0.02376-1.2002-0.05688-2.3306-0.31464-3.2976-0.73944l-2e-5 -8.3895v-4.8254c0-1.471 0.84816-2.7295 2.0736-3.3494l-0.02232-0.05328-1.2478-1.512c-1.6697 1.003-2.79 2.8224-2.79 4.9118v11.905c-0.04968-0.04968-0.30816-0.30888-0.48024-0.52992l-0.30744 0.6876c1.4011 1.4818 3.8088 2.4617 6.5426 2.4617 1.6798 0 3.2371-0.37368 4.5115-1.0022l-0.52704-0.40896-0.01006 0.0072z"
            opacity="0.5"
          />
        </g>

        <filter id="ledFilter" x="-0.8" y="-0.8" height="5.2" width="5.8">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="ledFilterRed" x="-0.8" y="-0.8" height="5.2" width="5.8">
          <feGaussianBlur stdDeviation={ledRed * 3} />
        </filter>
        <filter id="ledFilterGreen" x="-0.8" y="-0.8" height="5.2" width="5.8">
          <feGaussianBlur stdDeviation={ledGreen * 3} />
        </filter>
        <filter id="ledFilterBlue" x="-0.8" y="-0.8" height="5.2" width="5.8">
          <feGaussianBlur stdDeviation={ledBlue * 3} />
        </filter>

        <circle
          cx="1.7"
          cy="3"
          r={ledRed * 5 + 2}
          fill="rgb(255, 0, 0)"
          opacity={Math.min(ledRed * 20, 0.3)}
          filter="url(#ledFilterRed)"
        />
        <circle
          cx="2.7"
          cy="5"
          r={ledGreen * 5 + 2}
          fill="rgb(0, 255, 0)"
          opacity={Math.min(ledGreen * 20, 0.3)}
          filter="url(#ledFilterGreen)"
        />
        <circle
          cx="0.7"
          cy="5"
          r={ledBlue * 5 + 2}
          fill="rgb(1,85,253)"
          opacity={Math.min(ledBlue * 20, 0.3)}
          filter="url(#ledFilterBlue)"
        />

        <circle
          cx="1.7"
          cy="4"
          r="10"
          fill={`rgb(${ledRed * 255}, ${ledGreen * 255 + ledBlue * 90}, ${ledBlue * 255})`}
          filter="url(#ledFilter)"
          opacity={opacity}
        />

        {/* Grey hollow around the LED */}
        <circle
          cx="1.7"
          cy="4"
          r="13"
          stroke="#666"
          strokeWidth="1"
          fill="none"
          filter="url(#ledFilter)"
          opacity={opacity}
        />
      </svg>

      {/* Handles for pins */}
      {pinInfo.map((pin, index) => (
        <Handle
          key={`${pin.name}-source-${index}`}
          type="source"
          position={Position.Bottom}
          id={`${pin.name}-source`}
          style={{
            left: `${pin.x}px`,
            bottom: `${72.582 - pin.y}px`,
            width: '8px',
            height: '8px',
            background: '#1a192b',
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
            bottom: `${72.582 - pin.y}px`,
            width: '8px',
            height: '8px',
            background: '#1a192b',
            border: '2px solid #fff',
          }}
        />
      ))}
    </div>
  );
});

RGBLedNode.displayName = 'RGBLedNode';

export default RGBLedNode;
