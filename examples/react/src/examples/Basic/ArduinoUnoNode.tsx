import { Position, Handle, NodeProps, BuiltInNode } from '@xyflow/react';
import { useState, useRef } from 'react';

export default function ArduinoUnoNode({ data, isConnectable }: NodeProps<BuiltInNode>) {
  const [led13, setLed13] = useState(false);
  const [ledRX, setLedRX] = useState(false);
  const [ledTX, setLedTX] = useState(false);
  const [ledPower] = useState(true);
  const [resetPressed, setResetPressed] = useState(false);
  const resetButtonRef = useRef<SVGCircleElement>(null);

  const pinInfo = [
    { name: 'A5.2', x: 87, y: 9, isPower: false, position: Position.Top },
    { name: 'A4.2', x: 97, y: 9, isPower: false, position: Position.Top },
    { name: 'AREF', x: 106, y: 9, isPower: false, position: Position.Top },
    { name: 'GND.1', x: 115.5, y: 9, isPower: true, position: Position.Top },
    { name: '13', x: 125, y: 9, isPower: false, position: Position.Top },
    { name: '12', x: 134.5, y: 9, isPower: false, position: Position.Top },
    { name: '11', x: 144, y: 9, isPower: false, position: Position.Top },
    { name: '10', x: 153.5, y: 9, isPower: false, position: Position.Top },
    { name: '9', x: 163, y: 9, isPower: false, position: Position.Top },
    { name: '8', x: 173, y: 9, isPower: false, position: Position.Top },
    { name: '7', x: 189, y: 9, isPower: false, position: Position.Top },
    { name: '6', x: 198.5, y: 9, isPower: false, position: Position.Top },
    { name: '5', x: 208, y: 9, isPower: false, position: Position.Top },
    { name: '4', x: 217.5, y: 9, isPower: false, position: Position.Top },
    { name: '3', x: 227, y: 9, isPower: false, position: Position.Top },
    { name: '2', x: 236.5, y: 9, isPower: false, position: Position.Top },
    { name: '1', x: 246, y: 9, isPower: false, position: Position.Top },
    { name: '0', x: 255.5, y: 9, isPower: false, position: Position.Top },
    { name: 'IOREF', x: 131, y: 191.5, isPower: false, position: Position.Bottom },
    { name: 'RESET', x: 140.5, y: 191.5, isPower: false, position: Position.Bottom },
    { name: '3.3V', x: 150, y: 191.5, isPower: true, position: Position.Bottom },
    { name: '5V', x: 160, y: 191.5, isPower: true, position: Position.Bottom },
    { name: 'GND.2', x: 169.5, y: 191.5, isPower: true, position: Position.Bottom },
    { name: 'GND.3', x: 179, y: 191.5, isPower: true, position: Position.Bottom },
    { name: 'VIN', x: 188.5, y: 191.5, isPower: true, position: Position.Bottom },
    { name: 'A0', x: 208, y: 191.5, isPower: false, position: Position.Bottom },
    { name: 'A1', x: 217.5, y: 191.5, isPower: false, position: Position.Bottom },
    { name: 'A2', x: 227, y: 191.5, isPower: false, position: Position.Bottom },
    { name: 'A3', x: 236.5, y: 191.5, isPower: false, position: Position.Bottom },
    { name: 'A4', x: 246, y: 191.5, isPower: false, position: Position.Bottom },
    { name: 'A5', x: 255.5, y: 191.5, isPower: false, position: Position.Bottom },
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
      <style>{`
        text {
          font-size: 2px;
          font-family: monospace;
          user-select: none;
        }
      `}</style>
      {pinInfo.map((pin) => {
        const handleStyle = {
          position: 'absolute' as const,
          left: pin.position === Position.Top ? `${pin.x}px` : `${pin.x}px`,
          top: pin.position === Position.Top ? `${pin.y}px` : `${pin.y}px`,
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
              id={pin.name}
              isConnectable={isConnectable}
              style={handleStyle}
            />
            <Handle
              type="target"
              position={pin.position}
              id={pin.name}
              isConnectable={isConnectable}
              style={handleStyle}
            />
          </div>
        );
      })}

      <svg
        width="72.58mm"
        height="53.34mm"
        version="1.1"
        viewBox="-4 0 72.58 53.34"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <g id="led-body" fill="#eee">
            <rect x="0" y="0" height="1.2" width="2.6" fill="#c6c6c6" />
            <rect x="0.6" y="-0.1" width="1.35" height="1.4" stroke="#aaa" strokeWidth="0.05" />
          </g>

          <filter id="ledFilter" x="-0.8" y="-0.8" height="2.2" width="2.8">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>

          <pattern id="pins-female" width="2.54" height="2.54" patternUnits="userSpaceOnUse">
            <circle r=".4" cx="1.27" cy="1.27" fill="#1b1b1b" />
          </pattern>

          <pattern id="pin-male" width="2.54" height="4.80" patternUnits="userSpaceOnUse">
            <rect ry="0.3" rx="0.3" width="2.12" height="4.80" fill="#565656" />
            <ellipse cx="1" cy="1.13" rx="0.5" ry="0.5" fill="#aaa"></ellipse>
            <ellipse cx="1" cy="3.67" rx="0.5" ry="0.5" fill="#aaa"></ellipse>
          </pattern>

          <pattern id="mcu-leads" width="2.54" height="0.508" patternUnits="userSpaceOnUse">
            <path
              d="M 0.254,0 C 0.114,0 0,0.114 0,0.254 v 0 c 0,0.139 0,0.253 0,0.253 h 1.523 c 0,0 0,-0.114 0,-0.253 v 0 C 1.523,0.114 1.409,0 1.269,0 Z"
              fill="#ddd"
            />
          </pattern>
        </defs>

        {/* PCB */}
        <path
          d="m0.999 0a1 1 0 0 0-0.999 0.999v51.34a1 1 0 0 0 0.999 0.999h64.04a1 1 0 0 0 0.999-0.999v-1.54l2.539-2.539v-32.766l-2.539-2.539v-11.43l-1.524-1.523zm14.078 0.835h0.325l0.212 0.041h0l0.105 0.021 0.300 0.124 0.270 0.180 0.229 0.229 0.180 0.270 0.017 0.042 0.097 0.234 0.01 0.023 0.050 0.252 0.013 0.066v0.325l-0.063 0.318-0.040 0.097-0.083 0.202-0 0.001-0.180 0.270-0.229 0.229-0.270 0.180-0.300 0.124-0.106 0.020-0.212 0.042h-0.325l-0.212-0.042-0.106-0.020-0.300-0.124-0.270-0.180-0.229-0.229-0.180-0.270-0 -0.001-0.083-0.202-0.040-0.097-0.063-0.318v-0.325l0.013-0.066 0.050-0.252 0.01-0.023 0.097-0.234 0.017-0.042 0.180-0.270 0.229-0.229 0.270-0.180 0.300-0.124 0.105-0.021zm50.799 15.239h0.325l0.212 0.042 0.105 0.021 0.300 0.124 0.270 0.180 0.229 0.229 0.180 0.270 0.014 0.035 0.110 0.264 0.01 0.051 0.053 0.267v0.325l-0.03 0.152-0.033 0.166-0.037 0.089-0.079 0.191-0 0.020-0.180 0.270-0.229 0.229-0.270 0.180-0.071 0.029-0.228 0.094-0.106 0.021-0.212 0.042h-0.325l-0.212-0.042-0.106-0.021-0.228-0.094-0.071-0.029-0.270-0.180-0.229-0.229-0.180-0.270-0 -0.020-0.079-0.191-0.036-0.089-0.033-0.166-0.030-0.152v-0.325l0.053-0.267 0.010-0.051 0.109-0.264 0.014-0.035 0.180-0.270 0.229-0.229 0.270-0.180 0.300-0.124 0.105-0.021zm0 27.94h0.325l0.180 0.036 0.138 0.027 0.212 0.087 0.058 0.024 0.029 0.012 0.270 0.180 0.229 0.229 0.180 0.270 0.124 0.300 0.063 0.319v0.325l-0.063 0.318-0.124 0.300-0.180 0.270-0.229 0.229-0.270 0.180-0.300 0.124-0.106 0.021-0.212 0.042h-0.325l-0.212-0.042-0.105-0.021-0.300-0.124-0.270-0.180-0.229-0.229-0.180-0.270-0.124-0.300-0.063-0.318v-0.325l0.063-0.319 0.124-0.300 0.180-0.270 0.229-0.229 0.270-0.180 0.029-0.012 0.058-0.024 0.212-0.087 0.137-0.027zm-52.07 5.080h0.325l0.212 0.041 0.106 0.021 0.300 0.124 0.270 0.180 0.229 0.229 0.121 0.182 0.058 0.087h0l0.114 0.275 0.01 0.023 0.063 0.318v0.325l-0.035 0.179-0.027 0.139-0.01 0.023-0.114 0.275h-0l-0.180 0.270-0.229 0.229-0.270 0.180-0.300 0.124-0.106 0.020-0.212 0.042h-0.325l-0.212-0.042-0.105-0.020-0.300-0.124-0.270-0.180-0.229-0.229-0.180-0.270-0.114-0.275-0.01-0.023-0.027-0.139-0.036-0.179v-0.325l0.063-0.318 0.01-0.023 0.114-0.275 0.058-0.087 0.121-0.182 0.229-0.229 0.270-0.180 0.300-0.124 0.105-0.021z"
          fill="#2b6b99"
        />

        {/* Reset button */}
        <rect x="3.816" y="1.4125" width="6.2151" height="6.0268" fill="#9b9b9b" />
        <g fill="#e6e6e6">
          <rect x="2.1368" y="1.954" width="1.695" height=".84994" />
          <rect x="2.121" y="3.8362" width="1.695" height=".84994" />
          <rect x="2.0974" y="5.8608" width="1.695" height=".84994" />
          <rect x="10.031" y="6.0256" width="1.695" height=".84994" />
          <rect x="10.008" y="1.9528" width="1.695" height=".84994" />
        </g>
        <circle
          ref={resetButtonRef}
          cx="6.9619"
          cy="4.5279"
          r="1.5405"
          fill="#960000"
          stroke="#777"
          strokeWidth="0.15"
          style={{ cursor: 'pointer' }}
          onMouseDown={handleResetDown}
          onMouseUp={handleResetUp}
          onMouseLeave={handleResetLeave}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        />

        {/* USB Connector */}
        <g style={{ fill: '#b3b2b2', stroke: '#b3b2b2', strokeWidth: 0.010 }}>
          <ellipse cx="3.84" cy="9.56" rx="1.12" ry="1.03" />
          <ellipse cx="3.84" cy="21.04" rx="1.12" ry="1.03" />
          <g fill="#000">
            <rect width="11" height="11.93" x="-0.05" y="9.72" rx="0.2" ry="0.2" opacity="0.24" />
          </g>
          <rect x="-4" y="9.37" height="11.85" width="14.46" />
          <rect x="-4" y="9.61" height="11.37" width="14.05" fill="#706f6f" />
          <rect x="-4" y="9.71" height="11.17" width="13.95" fill="#9d9d9c" />
        </g>

        {/* Power jack */}
        <g strokeWidth=".254" fill="black">
          <path
            d="m-2.58 48.53v2.289c0 0.279 0.228 0.508 0.508 0.508h1.722c0.279 0 0.508-0.228 0.508-0.508v-2.289z"
            fill="#252728"
            opacity=".3"
          />
          <path
            d="m11.334 42.946c0-0.558-0.509-1.016-1.132-1.016h-10.043v9.652h10.043c0.622 0 1.132-0.457 1.132-1.016z"
            opacity=".3"
          />
          <path d="m-2.072 40.914c-0.279 0-0.507 0.204-0.507 0.454v8.435c0 0.279 0.228 0.507 0.507 0.507h1.722c0.279 0 0.507-0.228 0.507-0.507v-8.435c0-0.249-0.228-0.454-0.507-0.454z" />
          <path
            d="m-2.58 48.784v1.019c0 0.279 0.228 0.508 0.508 0.508h1.722c0.279 0 0.508-0.228 0.508-0.508v-1.019z"
            opacity=".3"
          />
          <path d="m11.334 43.327c0.139 0 0.254 0.114 0.254 0.254v4.064c0 0.139-0.114 0.254-0.254 0.254" />
          <path d="m11.334 42.438c0-0.558-0.457-1.016-1.016-1.016h-10.16v8.382h10.16c0.558 0 1.016-0.457 1.016-1.016z" />
          <path
            d="m10.064 49.804h-9.906v-8.382h1.880c-1.107 0-1.363 1.825-1.363 3.826 0 1.765 1.147 3.496 3.014 3.496h6.374z"
            opacity=".3"
          />
          <rect x="10.064" y="41.422" width=".254" height="8.382" fill="#ffffff" opacity=".2" />
          <path
            d="m10.318 48.744v1.059c0.558 0 1.016-0.457 1.016-1.016v-0.364c0 0.313-1.016 0.320-1.016 0.320z"
            opacity=".3"
          />
        </g>

        {/* Pin Headers */}
        <g transform="translate(17.497 1.27)">
          <rect width={0.38 + 2.54 * 10} height="2.54" fill="url(#pins-female)"></rect>
        </g>
        <g transform="translate(44.421 1.27)">
          <rect width={0.38 + 2.54 * 8} height="2.54" fill="url(#pins-female)"></rect>
        </g>
        <g transform="translate(26.641 49.53)">
          <rect width={0.38 + 2.54 * 8} height="2.54" fill="url(#pins-female)"></rect>
        </g>
        <g transform="translate(49.501 49.53)">
          <rect width={0.38 + 2.54 * 6} height="2.54" fill="url(#pins-female)"></rect>
        </g>

        {/* MCU */}
        <g>
          <path
            d="m64.932 41.627h-36.72c-0.209 0-0.379-0.170-0.379-0.379v-8.545c0-0.209 0.170-0.379 0.379-0.379h36.72c0.209 0 0.379 0.170 0.379 0.379v8.545c0 0.209-0.169 0.379-0.379 0.379z"
            fill="#292c2d"
          />
          <path
            d="m65.019 40.397c0 0.279-0.228 0.508-0.508 0.508h-35.879c-0.279 0-0.507 0.025-0.507-0.254v-6.338c0-0.279 0.228-0.508 0.507-0.508h35.879c0.279 0 0.508 0.228 0.508 0.508z"
            opacity=".3"
          />
          <path
            d="m65.019 40.016c0 0.279-0.228 0.508-0.508 0.508h-35.879c-0.279 0-0.507 0.448-0.507-0.508v-6.084c0-0.279 0.228-0.508 0.507-0.508h35.879c0.279 0 0.508 0.228 0.508 0.508z"
            fill="#3c4042"
          />
          <rect
            transform="translate(29.205, 32.778)"
            fill="url(#mcu-leads)"
            height="0.508"
            width="35.56"
          ></rect>
          <rect
            transform="translate(29.205, 41.159) scale(1 -1)"
            fill="url(#mcu-leads)"
            height="0.508"
            width="35.56"
          ></rect>
          <g fill="#252728">
            <circle cx="33.269" cy="36.847" r="1" />
            <circle cx="59.939" cy="36.847" r="1" />
            <path d="M65 38.05a1.13 1.13 0 010-2.26v2.27z" />
          </g>
        </g>

        {/* Programming Headers */}
        <g transform="translate(14.1 4.4)">
          <rect width="7" height="4.80" fill="url(#pin-male)" />
        </g>

        <g transform="translate(63 27.2) rotate(270 0 0)">
          <rect width="7" height="4.80" fill="url(#pin-male)" />
        </g>

        {/* LEDs */}
        <g transform="translate(57.3, 16.21)">
          <use xlinkHref="#led-body" />
          {ledPower && <circle cx="1.3" cy="0.55" r="1.3" fill="#80ff80" filter="url(#ledFilter)" />}
        </g>

        <text fill="#fff">
          <tspan x="60.88" y="17.5">
            ON
          </tspan>
        </text>

        <g transform="translate(26.87,11.69)">
          <use xlinkHref="#led-body" />
          {led13 && <circle cx="1.3" cy="0.55" r="1.3" fill="#ff8080" filter="url(#ledFilter)" />}
        </g>

        <g transform="translate(26.9, 16.2)">
          <use xlinkHref="#led-body" />
          {ledTX && <circle cx="0.975" cy="0.55" r="1.3" fill="yellow" filter="url(#ledFilter)" />}
        </g>

        <g transform="translate(26.9, 18.5)">
          <use xlinkHref="#led-body" />
          {ledRX && <circle cx="0.975" cy="0.55" r="1.3" fill="yellow" filter="url(#ledFilter)" />}
        </g>

        <text fill="#fff" style={{ textAnchor: 'end' }}>
          <tspan x="26.5" y="13">
            L
          </tspan>
          <tspan x="26.5" y="17.5">
            TX
          </tspan>
          <tspan x="26.5" y="19.8">
            RX
          </tspan>
        </text>

        {/* Pin Labels */}
        <rect x="28.27" y="10.34" width="36.5" height="0.16" fill="#fff"></rect>
        <text fill="#fff" style={{ fontWeight: 900 }}>
          <tspan x="40.84" y="9.48">
            DIGITAL (PWM ~)
          </tspan>
        </text>
        <text
          transform="translate(22.6 4) rotate(270 0 0)"
          fill="#fff"
          style={{ fontSize: '2px', textAnchor: 'end', fontFamily: 'monospace' }}
        >
          <tspan x="0" dy="2.54">
            AREF
          </tspan>
          <tspan x="0" dy="2.54">
            GND
          </tspan>
          <tspan x="0" dy="2.54">
            13
          </tspan>
          <tspan x="0" dy="2.54">
            12
          </tspan>
          <tspan x="0" dy="2.54">
            ~11
          </tspan>
          <tspan x="0" dy="2.54">
            ~10
          </tspan>
          <tspan x="0" dy="2.54">
            ~9
          </tspan>
          <tspan x="0" dy="2.54">
            8
          </tspan>
          <tspan x="0" dy="4.08">
            7
          </tspan>
          <tspan x="0" dy="2.54">
            ~6
          </tspan>
          <tspan x="0" dy="2.54">
            ~5
          </tspan>
          <tspan x="0" dy="2.54">
            4
          </tspan>
          <tspan x="0" dy="2.54">
            ~3
          </tspan>
          <tspan x="0" dy="2.54">
            2
          </tspan>
          <tspan x="0" dy="2.54">
            TX→1
          </tspan>
          <tspan x="0" dy="2.54">
            RX←0
          </tspan>
        </text>

        <rect x="33.90" y="42.76" width="12.84" height="0.16" fill="#fff"></rect>
        <rect x="49.48" y="42.76" width="14.37" height="0.16" fill="#fff"></rect>
        <text fill="#fff" style={{ fontWeight: 900 }}>
          <tspan x="41" y="44.96">
            POWER
          </tspan>
          <tspan x="53.5" y="44.96">
            ANALOG IN
          </tspan>
        </text>
        <text transform="translate(29.19 49) rotate(270 0 0)" fill="#fff" style={{ fontWeight: 700 }}>
          <tspan x="0" dy="2.54">
            IOREF
          </tspan>
          <tspan x="0" dy="2.54">
            RESET
          </tspan>
          <tspan x="0" dy="2.54">
            3.3V
          </tspan>
          <tspan x="0" dy="2.54">
            5V
          </tspan>
          <tspan x="0" dy="2.54">
            GND
          </tspan>
          <tspan x="0" dy="2.54">
            GND
          </tspan>
          <tspan x="0" dy="2.54">
            Vin
          </tspan>
          <tspan x="0" dy="4.54">
            A0
          </tspan>
          <tspan x="0" dy="2.54">
            A1
          </tspan>
          <tspan x="0" dy="2.54">
            A2
          </tspan>
          <tspan x="0" dy="2.54">
            A3
          </tspan>
          <tspan x="0" dy="2.54">
            A4
          </tspan>
          <tspan x="0" dy="2.54">
            A5
          </tspan>
        </text>

        {/* Logo */}
        <path
          style={{ fill: 'none', stroke: '#fff', strokeWidth: 1.03 }}
          d="m 34.21393,12.01079 c -1.66494,-0.13263 -3.06393,1.83547 -2.37559,3.36182 0.66469,1.65332 3.16984,2.10396 4.36378,0.77797 1.15382,-1.13053 1.59956,-2.86476 3.00399,-3.75901 1.43669,-0.9801 3.75169,-0.0547 4.02384,1.68886 0.27358,1.66961 -1.52477,3.29596 -3.15725,2.80101 -1.20337,-0.27199 -2.06928,-1.29866 -2.56193-2.37788 -0.6046,-1.0328 -1.39499,-2.13327 -2.62797-2.42367 -0.2191,-0.0497 -0.44434,-0.0693 -0.66887-0.0691 z"
        />
        <path
          style={{ fill: 'none', stroke: '#fff', strokeWidth: 0.56 }}
          d="m 39.67829,14.37519 h 1.75141 m -0.89321,-0.8757 v 1.7514 m -7.30334,-0.8757 h 2.10166"
        />
        <text x="31" y="20.2" style={{ fontSize: '2.8px', fontWeight: 'bold', lineHeight: 1.25, fill: '#fff' }}>
          ARDUINO
        </text>

        <rect
          style={{ fill: 'none', stroke: '#fff', strokeWidth: 0.1, strokeDasharray: '0.1, 0.1' }}
          width="11"
          height="5.45"
          x="45.19"
          y="11.83"
          rx="1"
          ry="1"
        />

        <text x="46.5" y="16" style={{ fontSize: '5px', lineHeight: 1.25 }} fill="#fff">
          UNO
        </text>
      </svg>
    </div>
  );
}
