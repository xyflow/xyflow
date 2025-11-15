import { memo } from 'react';
import { Handle, Position, NodeProps, BuiltInNode } from '@xyflow/react';

const LCD1602Node = ({ data }: NodeProps<BuiltInNode>) => {
  const text = (data.text as string) || 'Hello World!    ';
  const pins = (data.pins as 'full' | 'i2c' | 'none') || 'full';
  const backlight = (data.backlight as boolean) ?? true;
  const background = (data.background as string) || 'green';

  const numCols = 16;
  const numRows = 2;
  const panelHeight = numRows * 5.75;

  const backgroundColors: { [key: string]: string } = {
    green: '#6cb201',
    blue: '#000eff',
  };

  const actualBgColor = background in backgroundColors ? backgroundColors[background] : backgroundColors.green;
  const darken = backlight ? 0 : 0.5;

  const getPinInfo = () => {
    const y = 87.5 + panelHeight * 3.7795275591;
    switch (pins) {
      case 'i2c':
        return [
          { name: 'GND', x: 4, y: 32, number: 1, isPower: true, position: Position.Left },
          { name: 'VCC', x: 4, y: 41.5, number: 2, isPower: true, position: Position.Left },
          { name: 'SDA', x: 4, y: 51, number: 3, isPower: false, position: Position.Left },
          { name: 'SCL', x: 4, y: 60.5, number: 4, isPower: false, position: Position.Left },
        ];
      case 'full':
      default:
        return [
          { name: 'VSS', x: 32, y, number: 1, isPower: true, position: Position.Bottom },
          { name: 'VDD', x: 41.5, y, number: 2, isPower: true, position: Position.Bottom },
          { name: 'V0', x: 51.5, y, number: 3, isPower: false, position: Position.Bottom },
          { name: 'RS', x: 60.5, y, number: 4, isPower: false, position: Position.Bottom },
          { name: 'RW', x: 70.5, y, number: 5, isPower: false, position: Position.Bottom },
          { name: 'E', x: 80, y, number: 6, isPower: false, position: Position.Bottom },
          { name: 'D0', x: 89.5, y, number: 7, isPower: false, position: Position.Bottom },
          { name: 'D1', x: 99.5, y, number: 8, isPower: false, position: Position.Bottom },
          { name: 'D2', x: 109, y, number: 9, isPower: false, position: Position.Bottom },
          { name: 'D3', x: 118.5, y, number: 10, isPower: false, position: Position.Bottom },
          { name: 'D4', x: 128, y, number: 11, isPower: false, position: Position.Bottom },
          { name: 'D5', x: 137.5, y, number: 12, isPower: false, position: Position.Bottom },
          { name: 'D6', x: 147, y, number: 13, isPower: false, position: Position.Bottom },
          { name: 'D7', x: 156.5, y, number: 14, isPower: false, position: Position.Bottom },
          { name: 'A', x: 166.5, y, number: 15, isPower: false, position: Position.Bottom },
          { name: 'K', x: 176, y, number: 16, isPower: false, position: Position.Bottom },
        ];
    }
  };

  const pinInfo = getPinInfo();
  const panelWidth = numCols * 3.5125;
  const width = panelWidth + 23.8;
  const height = panelHeight + 24.5;
  const panelX = 12.45;
  const panelY = 12.55;

  return (
    <div style={{ position: 'relative' }}>
      {pinInfo.map((pin) => {
        const handleStyle = {
          position: 'absolute' as const,
          left: pin.position === Position.Left ? `${pin.x}px` : `${pin.x}px`,
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
        width={`${width}mm`}
        height={`${height}mm`}
        version="1.1"
        viewBox={`0 0 ${width} ${height}`}
        style={{ fontSize: '1.5px', fontFamily: 'monospace', userSelect: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="characters"
            width="3.55"
            height="5.95"
            patternUnits="userSpaceOnUse"
            x="12.45"
            y="12.55"
          >
            <rect width="2.95" height="5.55" fillOpacity="0.05" />
          </pattern>
          <pattern id="pins" width="2.54" height="3.255" patternUnits="userSpaceOnUse" y="1.1">
            <path
              fill="#92926d"
              d="M0,0.55c0,0 0.21,-0.52 0.87,-0.52 0.67,0 0.81,0.51 0.81,0.51v1.81h-1.869z"
            />
            <circle r="0.45" cx="0.827" cy="0.9" color="black" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="#087f45" />
        <rect x="4.95" y="5.7" width={panelWidth + 15} height={panelHeight + 13.7} />
        <rect
          x="7.55"
          y="10.3"
          width={panelWidth + 9.8}
          height={panelHeight + 4.5}
          rx="1.5"
          ry="1.5"
          fill={actualBgColor}
        />
        <rect
          x="7.55"
          y="10.3"
          width={panelWidth + 9.8}
          height={panelHeight + 4.5}
          rx="1.5"
          ry="1.5"
          opacity={darken}
        />
        {pins === 'i2c' && (
          <>
            <rect x="7.55" y="-2.5" height="2.5" width="10.16" fill="url(#pins)" transform="rotate(90)" />
            <text fill="white" fontSize="1.5px" fontFamily="monospace">
              <tspan y="6.8" x="0.7" fill="white">1</tspan>
              <tspan y="8.9" x="2.3" fill="white">GND</tspan>
              <tspan y="11.4" x="2.3" fill="white">VCC</tspan>
              <tspan y="14" x="2.3" fill="white">SDA</tspan>
              <tspan y="16.6" x="2.3" fill="white">SCL</tspan>
            </text>
          </>
        )}
        {pins === 'full' && (
          <g transform={`translate(0, ${panelHeight + 21.1})`}>
            <rect x="7.55" y="1" height="2.5" width="40.64" fill="url(#pins)" />
            <text fill="white" fontSize="1.5px" fontFamily="monospace">
              <tspan x="6" y="2.7">1</tspan>
              <tspan x="7.2" y="0.7">VSS</tspan>
              <tspan x="9.9" y="0.7">VDD</tspan>
              <tspan x="12.7" y="0.7">V0</tspan>
              <tspan x="15.2" y="0.7">RS</tspan>
              <tspan x="17.8" y="0.7">RW</tspan>
              <tspan x="20.8" y="0.7">E</tspan>
              <tspan x="22.7" y="0.7">D0</tspan>
              <tspan x="25.3" y="0.7">D1</tspan>
              <tspan x="27.9" y="0.7">D2</tspan>
              <tspan x="30.4" y="0.7">D3</tspan>
              <tspan x="33" y="0.7">D4</tspan>
              <tspan x="35.6" y="0.7">D5</tspan>
              <tspan x="38.2" y="0.7">D6</tspan>
              <tspan x="40.8" y="0.7">D7</tspan>
              <tspan x="43.6" y="0.7">A</tspan>
              <tspan x="46.2" y="0.7">K</tspan>
              <tspan x="48" y="2.7">16</tspan>
            </text>
          </g>
        )}
        <rect
          x={panelX}
          y={panelY}
          width={panelWidth}
          height={panelHeight}
          fill="url(#characters)"
        />
        <text
          x={panelX + 0.5}
          y={panelY + 3.5}
          fill="#000"
          fontSize="3.5px"
          fontFamily="monospace"
          fontWeight="bold"
        >
          <tspan x={panelX + 0.5} dy="0">{text.substring(0, 16)}</tspan>
          <tspan x={panelX + 0.5} dy="5.95">{text.substring(16, 32)}</tspan>
        </text>
      </svg>
    </div>
  );
};

LCD1602Node.displayName = 'LCD1602Node';

export default memo(LCD1602Node);
