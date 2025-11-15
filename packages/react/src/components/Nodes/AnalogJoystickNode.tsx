import { Position } from '@xyflow/system';
import { Handle } from '../../components/Handle';
import type { BuiltInNode, NodeProps } from '../../types/nodes';
import { useState, useRef } from 'react';

interface Signal {
  type: string;
  signal?: string;
  voltage?: number;
}

interface ElementPin {
  name: string;
  x: number;
  y: number;
  signals: Signal[];
}

function VCC(): Signal {
  return { type: 'power', signal: 'VCC' };
}

function GND(): Signal {
  return { type: 'power', signal: 'GND' };
}

function analog(index: number): Signal {
  return { type: 'analog', signal: `A${index}` };
}

export type AnalogJoystickNodeData = {
  label?: string;
  xValue?: number;
  yValue?: number;
  pressed?: boolean;
  [key: string]: unknown;
};

export function AnalogJoystickNode({
  data,
  isConnectable,
}: NodeProps<BuiltInNode>) {
  const nodeData = data as AnalogJoystickNodeData;
  const [xValue, setXValue] = useState(nodeData?.xValue || 0);
  const [yValue, setYValue] = useState(nodeData?.yValue || 0);
  const [pressed, setPressed] = useState(nodeData?.pressed || false);
  const knobRef = useRef<SVGCircleElement>(null);

  const pinInfo: ElementPin[] = [
    { name: 'VCC', x: 33, y: 115.8, signals: [VCC()] },
    { name: 'VERT', x: 42.6012, y: 115.8, signals: [analog(0)] },
    { name: 'HORZ', x: 52.2024, y: 115.8, signals: [analog(1)] },
    { name: 'SEL', x: 61.8036, y: 115.8, signals: [] },
    { name: 'GND', x: 71.4048, y: 115.8, signals: [GND()] },
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        setYValue(1);
        break;
      case 'ArrowDown':
        setYValue(-1);
        break;
      case 'ArrowLeft':
        setXValue(1);
        break;
      case 'ArrowRight':
        setXValue(-1);
        break;
      case ' ':
      case 'Enter':
        setPressed(true);
        break;
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        setYValue(0);
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        setXValue(0);
        break;
      case ' ':
      case 'Enter':
        setPressed(false);
        break;
    }
  };

  const handleMouseDown = (dx: number, dy: number) => (e: React.MouseEvent) => {
    if (dx) setXValue(dx);
    if (dy) setYValue(dy);
    knobRef.current?.focus();
    e.preventDefault();
  };

  const handleMouseUp = (x: boolean, y: boolean) => () => {
    if (x) setXValue(0);
    if (y) setYValue(0);
    knobRef.current?.focus();
  };

  const handlePress = (e: React.MouseEvent) => {
    setPressed(true);
    knobRef.current?.focus();
    e.preventDefault();
  };

  const handleRelease = () => {
    setPressed(false);
    knobRef.current?.focus();
  };

  return (
    <>
      {nodeData?.label && <div style={{ marginBottom: '8px' }}>{nodeData.label}</div>}
      <div style={{ position: 'relative' }}>
        {/* Render handles for each pin */}
        {pinInfo.map((pin) => {
          const handleStyle = {
            position: 'absolute' as const,
            left: `${pin.x - 7}px`,
            top: `${pin.y}px`,
            width: '4px',
            height: '4px',
            background: pin.signals.some((s) => s.type === 'power') ? '#ff0072' : '#1a192b',
            border: '1px solid white',
            cursor: 'crosshair',
          };

          return (
            <div key={pin.name}>
              <Handle
                type="source"
                position={Position.Right}
                id={pin.name}
                isConnectable={isConnectable}
                style={handleStyle}
              />
              <Handle
                type="target"
                position={Position.Right}
                id={pin.name}
                isConnectable={isConnectable}
                style={handleStyle}
              />
            </div>
          );
        })}

        <svg
          width="27.2mm"
          height="31.8mm"
          viewBox="0 0 27.2 31.8"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <filter id="noise" primitiveUnits="objectBoundingBox">
              <feTurbulence baseFrequency="2 2" type="fractalNoise" />
              <feColorMatrix
                values=".1 0 0 0 .1
                      .1 0 0 0 .1
                      .1 0 0 0 .1
                      0 0 0 0 1"
              />
              <feComposite in2="SourceGraphic" operator="lighter" />
              <feComposite result="body" in2="SourceAlpha" operator="in" />
            </filter>
            <radialGradient id="g-knob" cx="13.6" cy="13.6" r="10.6" gradientUnits="userSpaceOnUse">
              <stop offset="0" />
              <stop offset="0.9" />
              <stop stopColor="#777" offset="1" />
            </radialGradient>
            <radialGradient
              id="g-knob-base"
              cx="13.6"
              cy="13.6"
              r="13.6"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" />
              <stop stopColor="#444" offset=".8" />
              <stop stopColor="#555" offset=".9" />
              <stop offset="1" />
            </radialGradient>
            <path
              id="pin"
              fill="silver"
              stroke="#a2a2a2"
              strokeWidth=".024"
              d="M8.726 29.801a.828.828 0 00-.828.829.828.828 0 00.828.828.828.828 0 00.829-.828.828.828 0 00-.829-.829zm-.004.34a.49.49 0 01.004 0 .49.49 0 01.49.489.49.49 0 01-.49.49.49.49 0 01-.489-.49.49.49 0 01.485-.49z"
            />
          </defs>
          <path
            d="M1.3 0v31.7h25.5V0zm2.33.683a1.87 1.87 0 01.009 0 1.87 1.87 0 011.87 1.87 1.87 1.87 0 01-1.87 1.87 1.87 1.87 0 01-1.87-1.87 1.87 1.87 0 011.87-1.87zm20.5 0a1.87 1.87 0 01.009 0 1.87 1.87 0 011.87 1.87 1.87 1.87 0 01-1.87 1.87 1.87 1.87 0 01-1.87-1.87 1.87 1.87 0 011.87-1.87zm-20.5 26.8a1.87 1.87 0 01.009 0 1.87 1.87 0 011.87 1.87 1.87 1.87 0 01-1.87 1.87 1.87 1.87 0 01-1.87-1.87 1.87 1.87 0 011.87-1.87zm20.4 0a1.87 1.87 0 01.009 0 1.87 1.87 0 011.87 1.87 1.87 1.87 0 01-1.87 1.87 1.87 1.87 0 01-1.87-1.87 1.87 1.87 0 011.87-1.87zm-12.7 2.66a.489.489 0 01.004 0 .489.489 0 01.489.489.489.489 0 01-.489.489.489.489 0 01-.489-.489.489.489 0 01.485-.489zm2.57 0a.489.489 0 01.004 0 .489.489 0 01.489.489.489.489 0 01-.489.489.489.489 0 01-.489-.489.489.489 0 01.485-.489zm2.49.013a.489.489 0 01.004 0 .489.489 0 01.489.489.489.489 0 01-.489.489.489.489 0 01-.489-.489.489.489 0 01.485-.489zm-7.62.007a.489.489 0 01.004 0 .489.489 0 01.489.489.489.489 0 01-.489.489.489.489 0 01-.489-.49.489.489 0 01.485-.488zm10.2.013a.489.489 0 01.004 0 .489.489 0 01.489.489.489.489 0 01-.489.489.489.489 0 01-.489-.49.489.489 0 01.485-.488z"
            fill="#bd1e34"
          />
          <g fill="#fff" fontFamily="sans-serif" strokeWidth=".03">
            <text textAnchor="middle" fontSize="1.2" letterSpacing=".053">
              <tspan x="4.034" y="25.643">
                Analog
              </tspan>
              <tspan x="4.061" y="27.159">
                Joystick
              </tspan>
            </text>
            <text transform="rotate(-90)" textAnchor="start" fontSize="1.2">
              <tspan x="-29.2" y="9.2">
                VCC
              </tspan>
              <tspan x="-29.2" y="11.74">
                VERT
              </tspan>
              <tspan x="-29.2" y="14.28">
                HORZ
              </tspan>
              <tspan x="-29.2" y="16.82">
                SEL
              </tspan>
              <tspan x="-29.2" y="19.36">
                GND
              </tspan>
            </text>
          </g>
          <ellipse cx="13.6" cy="13.7" rx="13.6" ry="13.7" fill="url(#g-knob-base)" />
          <path
            d="M48.2 65.5s.042.179-.093.204c-.094.017-.246-.077-.322-.17-.094-.115-.082-.205-.009-.285.11-.122.299-.075.299-.075s-.345-.303-.705-.054c-.32.22-.228.52.06.783.262.237.053.497-.21.463-.18-.023-.252-.167-.21-.256.038-.076.167-.122.167-.122s-.149-.06-.324.005c-.157.06-.286.19-.276.513v1.51s.162-.2.352-.403c.214-.229.311-.384.53-.366.415.026.714-.159.918-.454.391-.569.085-1.2-.178-1.29"
            fill="#fff"
          />
          <circle
            ref={knobRef}
            cx="13.6"
            cy="13.6"
            transform={`translate(${2.5 * -xValue}, ${2.5 * -yValue})`}
            r="10.6"
            fill="url(#g-knob)"
            filter="url(#noise)"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            style={{
              transition: 'transform 0.3s',
              outline: 'none',
              cursor: 'pointer',
            }}
          />
          <g
            fill="none"
            stroke="#fff"
            strokeWidth=".142"
            style={{
              opacity: 0,
              transition: 'opacity 0.3s',
            }}
            className="controls"
          >
            <path d="M7.8 31.7l-.383-.351v-1.31l.617-.656h1.19l.721.656.675-.656h1.18l.708.656.662-.656h1.25l.643.656.63-.656h1.21l.695.656.636-.656h1.17l.753.656v1.3l-.416.39" />
            <path
              d="M9.5 31.7l.381-.344.381.331M12.1 31.7l.381-.344.381.331M14.7 31.7l.381-.344.381.331M17.2 31.7l.381-.344.381.331"
              strokeLinecap="square"
              strokeLinejoin="bevel"
            />
          </g>
          <g
            strokeWidth="0.6"
            strokeLinejoin="bevel"
            fill="#aaa"
            style={{
              opacity: 0,
              transition: 'opacity 0.3s',
              cursor: 'pointer',
            }}
            className="controls"
            onMouseEnter={(e) => {
              (e.currentTarget as SVGGElement).style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as SVGGElement).style.opacity = '0';
            }}
          >
            <rect
              className="region"
              y="8.5"
              x="1"
              height="10"
              width="7"
              fill="none"
              onMouseDown={handleMouseDown(1, 0)}
              onMouseUp={handleMouseUp(true, false)}
            />
            <path d="m 7.022,11.459 -3.202,2.497 3.202,2.497" style={{ pointerEvents: 'none' }} />

            <rect
              className="region"
              y="1.38"
              x="7.9"
              height="7"
              width="10"
              fill="none"
              onMouseDown={handleMouseDown(0, 1)}
              onMouseUp={handleMouseUp(false, true)}
            />
            <path
              d="m 16.615,7.095 -2.497,-3.202 -2.497,3.202"
              style={{ pointerEvents: 'none' }}
            />

            <rect
              className="region"
              y="8.5"
              x="18"
              height="10"
              width="7"
              fill="none"
              onMouseDown={handleMouseDown(-1, 0)}
              onMouseUp={handleMouseUp(true, false)}
            />
            <path
              d="m 19.980,16.101 3.202,-2.497 -3.202,-2.497"
              style={{ pointerEvents: 'none' }}
            />

            <rect
              className="region"
              y="17"
              x="7.9"
              height="7"
              width="10"
              fill="none"
              onMouseDown={handleMouseDown(0, -1)}
              onMouseUp={handleMouseUp(false, true)}
            />
            <path
              d="m 11.620,20.112 2.497,3.202 2.497,-3.202"
              style={{ pointerEvents: 'none' }}
            />

            <circle
              cx="13.6"
              cy="13.6"
              r="3"
              stroke="#aaa"
              fill={pressed ? '#fff' : '#aaa'}
              onMouseDown={handlePress}
              onMouseUp={handleRelease}
              style={{ cursor: 'pointer' }}
            />
          </g>
          <use xlinkHref="#pin" x="0" />
          <use xlinkHref="#pin" x="2.54" />
          <use xlinkHref="#pin" x="5.08" />
          <use xlinkHref="#pin" x="7.62" />
          <use xlinkHref="#pin" x="10.16" />
        </svg>

        <style>
          {`
            .controls:hover {
              opacity: 1 !important;
            }
            .controls .region:hover + path {
              fill: #fff;
            }
            .controls circle:hover {
              stroke: #fff;
            }
          `}
        </style>
      </div>
    </>
  );
}
