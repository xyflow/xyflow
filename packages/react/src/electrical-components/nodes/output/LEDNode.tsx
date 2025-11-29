import { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';

export type LEDNode = Node<{
  value?: boolean;
  brightness?: number;
  color?: string;
  label?: string;
  flip?: boolean;
  health?: string;
}, 'led'>;

const LEDNodeComponent = ({ data, id }: NodeProps<LEDNode>) => {
  const value = (data.value as boolean) || false;
  const brightness = (data.brightness as number) ?? 0;
  const color = (data.color as string) || 'red';
  const label = (data.label as string) || '';
  const flip = (data.flip as boolean) || false;

  console.log('💡 LEDNode render:', {
    id,
    value,
    brightness,
    data,
  });

  const lightColors: { [key: string]: string } = {
    red: '#ff0000',
    green: '#80ff80',
    blue: '#8080ff',
    yellow: '#ffff80',
    orange: '#ffcf80',
    white: '#ffffff',
    purple: '#ff80ff',
  };

  const lightColorActual = lightColors[color?.toLowerCase()] || color;
  const isBlown = data.health === 'BLOWN';
  const opacity = isBlown ? 0 : (brightness ? 0.3 + brightness * 0.7 : 0);
  const lightOn = !isBlown && brightness > 0.01; // Light on if brightness > 1%
  const xScale = flip ? -1 : 1;

  console.log('💡 LEDNode computed:', { lightOn, opacity, lightColorActual });

  const anodeX = flip ? 15 : 25;
  const cathodeX = flip ? 25 : 15;

  const pinInfo = [
    { name: 'A', x: anodeX, y: 42, isPower: false, position: Position.Bottom },
    { name: 'C', x: cathodeX, y: 42, isPower: false, position: Position.Bottom },
  ];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
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

      <div style={{ display: 'flex', flexDirection: 'column', width: '40px' }}>
        <svg
          width="40"
          height="50"
          transform={`scale(${xScale} 1)`}
          version="1.2"
          viewBox="-10 -5 35.456 39.618"
          xmlns="http://www.w3.org/2000/svg"
          style={{ userSelect: 'none' }}
        >
          <filter id="light1" x="-0.8" y="-0.8" height="2.2" width="2.8">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <filter id="light2" x="-0.8" y="-0.8" height="2.2" width="2.8">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <rect x="2.5099" y="20.382" width="2.1514" height="9.8273" fill="#8c8c8c" />
          <path
            d="m12.977 30.269c0-1.1736-0.86844-2.5132-1.8916-3.4024-0.41616-0.3672-1.1995-1.0015-1.1995-1.4249v-5.4706h-2.1614v5.7802c0 1.0584 0.94752 1.8785 1.9462 2.7482 0.44424 0.37584 1.3486 1.2496 1.3486 1.7694"
            fill="#8c8c8c"
          />

          <path
            d="m14.173 13.001v-5.9126c0-3.9132-3.168-7.0884-7.0855-7.0884-3.9125 0-7.0877 3.1694-7.0877 7.0884v13.649c1.4738 1.651 4.0968 2.7526 7.0877 2.7526 4.6195 0 8.3686-2.6179 8.3686-5.8594v-1.5235c-7.4e-4 -1.1426-0.47444-2.2039-1.283-3.1061z"
            opacity=".3"
          />
          <path
            d="m14.173 13.001v-5.9126c0-3.9132-3.168-7.0884-7.0855-7.0884-3.9125 0-7.0877 3.1694-7.0877 7.0884v13.649c1.4738 1.651 4.0968 2.7526 7.0877 2.7526 4.6195 0 8.3686-2.6179 8.3686-5.8594v-1.5235c-7.4e-4 -1.1426-0.47444-2.2039-1.283-3.1061z"
            fill="#e6e6e6"
            opacity=".5"
          />
          <path
            d="m14.173 13.001v3.1054c0 2.7389-3.1658 4.9651-7.0855 4.9651-3.9125 2e-5 -7.0877-2.219-7.0877-4.9651v4.6296c1.4738 1.6517 4.0968 2.7526 7.0877 2.7526 4.6195 0 8.3686-2.6179 8.3686-5.8586l-4e-5 -1.5235c-7e-4 -1.1419-0.4744-2.2032-1.283-3.1054z"
            fill="#d1d1d1"
            opacity=".9"
          />
          <g>
            <path
              d="m14.173 13.001v3.1054c0 2.7389-3.1658 4.9651-7.0855 4.9651-3.9125 2e-5 -7.0877-2.219-7.0877-4.9651v4.6296c1.4738 1.6517 4.0968 2.7526 7.0877 2.7526 4.6195 0 8.3686-2.6179 8.3686-5.8586l-4e-5 -1.5235c-7e-4 -1.1419-0.4744-2.2032-1.283-3.1054z"
              opacity=".7"
            />
            <path
              d="m14.173 13.001v3.1054c0 2.7389-3.1658 4.9651-7.0855 4.9651-3.9125 2e-5 -7.0877-2.219-7.0877-4.9651v3.1054c1.4738 1.6502 4.0968 2.7526 7.0877 2.7526 4.6195 0 8.3686-2.6179 8.3686-5.8586-7.4e-4 -1.1412-0.47444-2.2025-1.283-3.1047z"
              opacity=".25"
            />
            <ellipse cx="7.0877" cy="16.106" rx="7.087" ry="4.9608" opacity=".25" />
          </g>
          <polygon
            points="2.2032 16.107 3.1961 16.107 3.1961 13.095 6.0156 13.095 10.012 8.8049 3.407 8.8049 2.2032 9.648"
            fill="#666666"
          />
          <polygon
            points="11.215 9.0338 7.4117 13.095 11.06 13.095 11.06 16.107 11.974 16.107 11.974 8.5241 10.778 8.5241"
            fill="#666666"
          />
          <path
            d="m14.173 13.001v-5.9126c0-3.9132-3.168-7.0884-7.0855-7.0884-3.9125 0-7.0877 3.1694-7.0877 7.0884v13.649c1.4738 1.651 4.0968 2.7526 7.0877 2.7526 4.6195 0 8.3686-2.6179 8.3686-5.8594v-1.5235c-7.4e-4 -1.1426-0.47444-2.2039-1.283-3.1061z"
            fill={color}
            opacity=".65"
          />
          <g fill="#ffffff">
            <path
              d="m10.388 3.7541 1.4364-0.2736c-0.84168-1.1318-2.0822-1.9577-3.5417-2.2385l0.25416 1.0807c0.76388 0.27072 1.4068 0.78048 1.8511 1.4314z"
              opacity=".5"
            />
            <path
              d="m0.76824 19.926v1.5199c0.64872 0.5292 1.4335 0.97632 2.3076 1.3169v-1.525c-0.8784-0.33624-1.6567-0.78194-2.3076-1.3118z"
              opacity=".5"
            />
            <path
              d="m11.073 20.21c-0.2556 0.1224-0.52992 0.22968-0.80568 0.32976-0.05832 0.01944-0.11736 0.04032-0.17784 0.05832-0.56376 0.17928-1.1614 0.31896-1.795 0.39456-0.07488 0.0094-0.1512 0.01872-0.22464 0.01944-0.3204 0.03024-0.64368 0.05832-0.97056 0.05832-0.14832 0-0.30744-0.01512-0.4716-0.02376-1.2002-0.05688-2.3306-0.31464-3.2976-0.73944l-2e-5 -8.3895v-4.8254c0-1.471 0.84816-2.7295 2.0736-3.3494l-0.02232-0.05328-1.2478-1.512c-1.6697 1.003-2.79 2.8224-2.79 4.9118v11.905c-0.04968-0.04968-0.30816-0.30888-0.48024-0.52992l-0.30744 0.6876c1.4011 1.4818 3.8088 2.4617 6.5426 2.4617 1.6798 0 3.2371-0.37368 4.5115-1.0022l-0.52704-0.40896-0.01006 0.0072z"
              opacity=".5"
            />
          </g>
          {lightOn && (
            <g className="light">
              <ellipse
                cx="8"
                cy="10"
                rx="10"
                ry="10"
                fill={lightColorActual}
                filter="url(#light2)"
                style={{ opacity }}
              />
              <ellipse cx="8" cy="10" rx="2" ry="2" fill="white" filter="url(#light1)" />
              <ellipse
                cx="8"
                cy="10"
                rx="3"
                ry="3"
                fill="white"
                filter="url(#light1)"
                style={{ opacity }}
              />
            </g>
          )}
        </svg>
        <span
          style={{
            fontSize: '10px',
            textAlign: 'center',
            color: 'gray',
            position: 'relative',
            lineHeight: 1,
            top: '-8px',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

LEDNodeComponent.displayName = 'LEDNode';
export default memo(LEDNodeComponent);

