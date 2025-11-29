import { Position, Handle, NodeProps, BuiltInNode } from '@xyflow/react';
import { useState, useRef } from 'react';

export default function ArduinoNanoNode({ data, isConnectable }: NodeProps<BuiltInNode>) {
  const [led13] = useState(false);
  const [ledRX] = useState(false);
  const [ledTX] = useState(false);
  const [ledPower] = useState(true);
  const [resetPressed, setResetPressed] = useState(false);
  const resetButtonRef = useRef<SVGCircleElement>(null);

  const pinInfo = [
    { name: '12', x: 19.7, y: 4.8, isPower: false, position: Position.Top },
    { name: '11', x: 29.3, y: 4.8, isPower: false, position: Position.Top },
    { name: '10', x: 38.9, y: 4.8, isPower: false, position: Position.Top },
    { name: '9', x: 48.5, y: 4.8, isPower: false, position: Position.Top },
    { name: '8', x: 58.1, y: 4.8, isPower: false, position: Position.Top },
    { name: '7', x: 67.7, y: 4.8, isPower: false, position: Position.Top },
    { name: '6', x: 77.3, y: 4.8, isPower: false, position: Position.Top },
    { name: '5', x: 86.9, y: 4.8, isPower: false, position: Position.Top },
    { name: '4', x: 96.5, y: 4.8, isPower: false, position: Position.Top },
    { name: '3', x: 106.1, y: 4.8, isPower: false, position: Position.Top },
    { name: '2', x: 115.7, y: 4.8, isPower: false, position: Position.Top },
    { name: 'GND.2', x: 125.3, y: 4.8, isPower: true, position: Position.Top },
    { name: 'RESET.2', x: 134.9, y: 4.8, isPower: false, position: Position.Top },
    { name: '0', x: 144.5, y: 4.8, isPower: false, position: Position.Top },
    { name: '1', x: 154.1, y: 4.8, isPower: false, position: Position.Top },
    { name: '13', x: 19.7, y: 62.4, isPower: false, position: Position.Bottom },
    { name: '3.3V', x: 29.3, y: 62.4, isPower: true, position: Position.Bottom },
    { name: 'AREF', x: 38.9, y: 62.4, isPower: false, position: Position.Bottom },
    { name: 'A0', x: 48.5, y: 62.4, isPower: false, position: Position.Bottom },
    { name: 'A1', x: 58.1, y: 62.4, isPower: false, position: Position.Bottom },
    { name: 'A2', x: 67.7, y: 62.4, isPower: false, position: Position.Bottom },
    { name: 'A3', x: 77.3, y: 62.4, isPower: false, position: Position.Bottom },
    { name: 'A4', x: 86.9, y: 62.4, isPower: false, position: Position.Bottom },
    { name: 'A5', x: 96.5, y: 62.4, isPower: false, position: Position.Bottom },
    { name: 'A6', x: 106.1, y: 62.4, isPower: false, position: Position.Bottom },
    { name: 'A7', x: 115.7, y: 62.4, isPower: false, position: Position.Bottom },
    { name: '5V', x: 125.3, y: 62.4, isPower: true, position: Position.Bottom },
    { name: 'RESET', x: 134.9, y: 62.4, isPower: false, position: Position.Bottom },
    { name: 'GND.1', x: 144.5, y: 62.4, isPower: true, position: Position.Bottom },
    { name: 'VIN', x: 154.1, y: 62.4, isPower: true, position: Position.Bottom },
  ];

  const handleResetDown = () => {
    if (resetPressed) return;
    setResetPressed(true);
    if (resetButtonRef.current) {
      resetButtonRef.current.style.stroke = '#333';
    }
  };

  const handleResetUp = () => {
    if (!resetPressed) return;
    setResetPressed(false);
    if (resetButtonRef.current) {
      resetButtonRef.current.style.stroke = '';
    }
  };

  const handleResetLeave = () => {
    resetButtonRef.current?.blur();
    handleResetUp();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      handleResetDown();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      handleResetUp();
    }
  };

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
        width="44.9mm"
        height="17.8mm"
        viewBox="-1.4 0 44.9 17.8"
        fontWeight="bold"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <filter id="solderPlate" style={{ colorInterpolationFilters: 'sRGB' }}>
            <feTurbulence result="r0" type="fractalNoise" baseFrequency="1" numOctaves="1" />
            <feComposite
              result="r1"
              in="r0"
              in2="SourceGraphic"
              operator="arithmetic"
              k1=".6"
              k2=".6"
              k3="1.2"
              k4=".25"
            />
            <feBlend result="r2" in="r1" in2="SourceGraphic" mode="luminosity" />
            <feComposite result="r3" in="r2" in2="SourceGraphic" operator="in" />
          </filter>
          <pattern id="pins-tqfp-0.5mm" width="1" height=".5" patternUnits="userSpaceOnUse">
            <rect fill="#333" width="1" height=".2" y=".17" />
          </pattern>
          <pattern id="pins-pth-0.75" width="2.54" height="2.54" patternUnits="userSpaceOnUse">
            <circle r=".75" cx="1.27" cy="1.27" fill="#333" filter="url(#solderPlate)" />
            <g stroke="#333" strokeWidth=".05" paintOrder="stroke fill">
              <circle r=".375" cx="1.27" cy="1.27" fill="#eee" />
            </g>
          </pattern>
          <pattern id="pins-pth-1.00" width="2.54" height="2.54" patternUnits="userSpaceOnUse">
            <circle r=".75" cx="1.27" cy="1.27" fill="#333" filter="url(#solderPlate)" />
            <g stroke="#333" strokeWidth=".05" paintOrder="stroke fill">
              <circle r=".5" cx="1.27" cy="1.27" fill="#eee" />
            </g>
          </pattern>
          <g id="led-body" fill="#eee">
            <rect x="0" y="0" height="1.2" width="2.6" fill="#333" filter="url(#solderPlate)" />
            <rect x=".6" y="-0.1" width="1.35" height="1.4" stroke="#aaa" strokeWidth=".05" />
          </g>
          <filter id="ledFilter" x="-0.8" y="-0.8" height="2.2" width="2.8">
            <feGaussianBlur stdDeviation=".5" />
          </filter>
        </defs>

        {/* PCB */}
        <g id="pcb" fill="#fff">
          <rect width="43.5" height="17.8" x="0" y="0" fill="#1b7e84" />
          <circle cx="1" cy="1" r=".889" />
          <circle cx="42.42" cy="1" r=".889" />
          <circle cx="42.42" cy="16.6" r=".889" />
          <circle cx="1" cy="16.6" r=".889" />
        </g>

        {/* silkscreen */}
        <g id="silkscreen" fill="#eee" textAnchor="middle">
          <rect x="30.48" y="0" width="2.54" height="3.2" />
          <rect x="35.56" y="14.6" width="2.54" height="3.2" />
          <g fill="#1b7e84" transform="translate(1.27 1.27)">
            <circle r=".85" cx="30.48" />
            <circle r=".85" cx="35.56" cy="15.24" />
          </g>
          <g transform="translate(1.27 3)" fontSize="1px" fontFamily="monospace">
            <text x="2.54">D12</text>
            <text x="5.08">D11</text>
            <text x="7.62">D10</text>
            <text x="10.16">D9</text>
            <text x="12.7">D8</text>
            <text x="15.24">D7</text>
            <text x="17.78">D6</text>
            <text x="20.32">D5</text>
            <text x="22.86">D4</text>
            <text x="25.4">D3</text>
            <text x="27.94">D2</text>
            <text x="30.48" fill="#1b7e84">
              GND
            </text>
            <text x="33.02">RST</text>
            <text x="35.56" fontSize="2px">
              ↓
            </text>
            <text x="35.56" y="1">
              RX0
            </text>
            <text x="38.1" fontSize="2px">
              ↑
            </text>
            <text x="38.1" y="1">
              TX1
            </text>
          </g>
          <g transform="translate(1.27 15.5)" fontSize="1px" fontFamily="monospace">
            <text x="2.54">D13</text>
            <text x="5.08">3V3</text>
            <text x="7.62">AREF</text>
            <text x="10.16">A0</text>
            <text x="12.7">A1</text>
            <text x="15.24">A2</text>
            <text x="17.78">A3</text>
            <text x="20.32">A4</text>
            <text x="22.86">A5</text>
            <text x="25.4">A6</text>
            <text x="27.94">A7</text>
            <text x="30.48">5V</text>
            <text x="33.02">RST</text>
            <text x="35.56" fill="#1b7e84">
              GND
            </text>
            <text x="38.1">VIN</text>
          </g>
          <g transform="rotate(90)" fontSize="1px" fontFamily="monospace">
            <text x="8.7" y="-22.5">
              RESET
            </text>
            <text x="5.6" y="-32.2">
              TX
            </text>
            <text x="5.6" y="-30.7" fontSize="2px">
              ↓
            </text>
            <text x="7.6" y="-32.2">
              RX
            </text>
            <text x="7.6" y="-30.7" fontSize="2px">
              ↑
            </text>
            <text x="9.6" y="-30.7">
              ON
            </text>
            <text x="11.6" y="-30.7">
              L
            </text>
          </g>
        </g>

        {/* MCU */}
        <g id="mcu" transform="rotate(45 -2.978 23.39)">
          <g fill="url(#pins-tqfp-0.5mm)" filter="url(#solderPlate)">
            <rect x="-2.65" y="-1.975" width="5.3" height="3.95" />
            <rect x="-2.65" y="-1.975" width="5.3" height="3.95" transform="rotate(90)" />
          </g>
          <rect x="-2.275" y="-2.275" width="4.55" height="4.55" fill="#444" />
          <circle transform="rotate(45)" cx=".012" cy="-2.5" r=".35" fill="#222" />
        </g>

        {/* pins */}
        <g id="pins" fill="url(#pins-pth-0.75)">
          <g id="pins-pin1" fill="#333" filter="url(#solderPlate)">
            <rect x={15.5 * 2.54 - 0.875} y={0.5 * 2.54 - 0.875} width="1.75" height="1.75" />
            <rect x={15.5 * 2.54 - 0.875} y={6.5 * 2.54 - 0.875} width="1.75" height="1.75" />
          </g>
          <rect x="2.54" width={15 * 2.54} height="2.54" />
          <rect x="2.54" y={6 * 2.54} width={15 * 2.54} height="2.54" />
        </g>

        {/* programming header */}
        <g id="pgm-header" fill="url(#pins-pth-1.00)" stroke="#eee" strokeWidth=".1">
          <g id="pgm-pin1" stroke="none" fill="#333" filter="url(#solderPlate)">
            <rect x={16.5 * 2.54 - 0.875} y={4.5 * 2.54 - 0.875} width="1.75" height="1.75" />
          </g>
          <rect x={15 * 2.54} y={2 * 2.54} width={2 * 2.54} height={3 * 2.54} />
        </g>

        {/* USB mini type B */}
        <g id="usb-mini-b" strokeWidth=".1" paintOrder="stroke fill">
          <g fill="#333" filter="url(#solderPlate)">
            <rect x=".3" y="3.8" width="1.6" height="9.8" />
            <rect x="5.5" y="3.8" width="1.6" height="9.8" />
            <rect x="7.3" y="7.07" width="1.1" height=".48" />
            <rect x="7.3" y="7.82" width="1.1" height=".48" />
            <rect x="7.3" y="8.58" width="1.1" height=".48" />
            <rect x="7.3" y="9.36" width="1.1" height=".48" />
            <rect x="7.3" y="10.16" width="1.1" height=".48" />
          </g>
          <rect x="-1.4" y="4.8" width="8.9" height="7.8" fill="#999" strokeWidth=".26" />
          <rect x="-1.25" y="5" width="8.6" height="7.4" fill="#ccc" stroke="#bbb" />
          <g fill="none" stroke="#333" strokeWidth=".26" strokeLinecap="round">
            <path d="m2.6 5.9h-3.3v0.9h3.3m0 3.7h-3.3v0.9h3.3M-0.6 7.6l4.3 0.3v1.5l-4.3 0.3" />
            <path d="m3.3 7.9v1.5" strokeWidth="1" strokeLinecap="butt" />
            <path d="m6 6.4v4.5" strokeWidth=".35" />
          </g>
        </g>

        {/* LEDs */}
        <g transform="translate(27.7 5)">
          <use xlinkHref="#led-body" />
          {ledTX && <circle cx="1.3" cy=".55" r="1.3" fill="#ff8080" filter="url(#ledFilter)" />}
        </g>
        <g transform="translate(27.7 7)">
          <use xlinkHref="#led-body" />
          {ledRX && <circle cx="1.3" cy=".55" r="1.3" fill="#80ff80" filter="url(#ledFilter)" />}
        </g>
        <g transform="translate(27.7 9)">
          <use xlinkHref="#led-body" />
          {ledPower && (
            <circle cx="1.3" cy=".55" r="1.3" fill="#80ff80" filter="url(#ledFilter)" />
          )}
        </g>
        <g transform="translate(27.7 11)">
          <use xlinkHref="#led-body" />
          {led13 && <circle cx="1.3" cy=".55" r="1.3" fill="#ffff80" filter="url(#ledFilter)" />}
        </g>

        {/* reset button */}
        <g strokeWidth=".1" paintOrder="fill stroke">
          <rect x="24.3" y="6.3" width="1" height="4.8" filter="url(#solderPlate)" fill="#333" />
          <rect x="23.54" y="6.8" width="2.54" height="3.8" fill="#ccc" stroke="#888" />
          <circle
            ref={resetButtonRef}
            cx="24.8"
            cy="8.7"
            r="1"
            fill="#eeb"
            stroke="#777"
            tabIndex={0}
            onMouseDown={handleResetDown}
            onTouchStart={handleResetDown}
            onMouseUp={handleResetUp}
            onMouseLeave={handleResetLeave}
            onTouchEnd={handleResetLeave}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            style={{ cursor: 'pointer', outline: 'none' }}
          />
        </g>
      </svg>
    </div>
  );
}
