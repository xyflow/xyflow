import { memo, useRef, useEffect, useState } from 'react';
import { Handle, Position, NodeProps, BuiltInNode } from '@xyflow/react';

const SSD1306Node = ({ id }: NodeProps<BuiltInNode>) => {
  const width = 150;
  const height = 116;
  const screenWidth = 128;
  const screenHeight = 64;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageData] = useState(new ImageData(screenWidth, screenHeight));

  const pinInfo = [
    { name: 'DATA', x: 36.5, y: 12.5, signals: [{ type: 'i2c', signal: 'SDA' }] },
    { name: 'CLK', x: 45.5, y: 12.5, signals: [{ type: 'i2c', signal: 'SCL' }] },
    { name: 'DC', x: 54.5, y: 12.5, signals: [] },
    { name: 'RST', x: 64.5, y: 12.5, signals: [] },
    { name: 'CS', x: 74.5, y: 12.5, signals: [] },
    { name: '3V3', x: 83.5, y: 12.5, signals: [{ type: 'power', signal: 'VCC', voltage: 3.3 }] },
    { name: 'VIN', x: 93.5, y: 12.5, signals: [{ type: 'power', signal: 'VCC' }] },
    { name: 'GND', x: 103.5, y: 12, signals: [{ type: 'power', signal: 'GND' }] },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.putImageData(imageData, 0, 0);
    }
  }, [imageData]);

  return (
    <div
      style={{
        background: 'transparent',
        padding: 0,
        position: 'relative',
      }}
    >
      {/* Handles for pins */}
      {pinInfo.map((pin) => (
        <Handle
          key={`${id}-${pin.name}-source`}
          type="source"
          position={Position.Top}
          id={`${id}-${pin.name}-source`}
          style={{
            left: `${pin.x}px`,
            top: `${pin.y}px`,
            background:
              pin.name === 'GND' || pin.name === 'VIN' || pin.name === '3V3'
                ? '#ff0072'
                : '#1a192b',
          }}
        />
      ))}
      {pinInfo.map((pin) => (
        <Handle
          key={`${id}-${pin.name}-target`}
          type="target"
          position={Position.Top}
          id={`${id}-${pin.name}-target`}
          style={{
            left: `${pin.x}px`,
            top: `${pin.y}px`,
            background:
              pin.name === 'GND' || pin.name === 'VIN' || pin.name === '3V3'
                ? '#ff0072'
                : '#1a192b',
          }}
        />
      ))}

      <div style={{ position: 'relative' }}>
        <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
          <rect stroke="#BE9B72" fill="#025CAF" x=".5" y=".5" width="148" height="114" rx="13" />

          <g transform="translate(6 6)" fill="#59340A" stroke="#BE9B72" strokeWidth="0.6px">
            <circle cx="130" cy="6" r="5.5" />
            <circle cx="6" cy="6" r="5.5" />
            <circle cx="130" cy="96" r="5.5" />
            <circle cx="6" cy="96" r="5.5" />
          </g>

          {/* 128 x 64 screen */}
          <rect x="11.4" y="26" fill="#1A1A1A" width={screenWidth} height={screenHeight} />

          {/* All texts */}
          <text
            fill="#FFF"
            textAnchor="middle"
            fontSize="5"
            fontWeight="300"
            fontFamily="monospace"
          >
            <tspan x="37" y="8">
              Data
            </tspan>
            <tspan x="56" y="8">
              SA0
            </tspan>
            <tspan x="78" y="8">
              CS
            </tspan>
            <tspan x="97" y="8">
              Vin
            </tspan>
            <tspan x="41" y="23">
              C1k
            </tspan>
            <tspan x="53" y="23">
              DC
            </tspan>
            <tspan x="64" y="23">
              Rst
            </tspan>
            <tspan x="80" y="23">
              3v3
            </tspan>
            <tspan x="99" y="23">
              Gnd
            </tspan>
          </text>

          {/* Star */}
          <path
            fill="#FFF"
            d="M115.5 10.06l-1.59 2.974-3.453.464 2.495 2.245-.6 3.229 3.148-1.528 3.148 1.528-.6-3.23 2.495-2.244-3.453-.464-1.59-2.974z"
            stroke="#FFF"
          />

          {/* PINS */}
          <g transform="translate(33 9)" fill="#9D9D9A" strokeWidth="0.4">
            <circle stroke="#262626" cx="70.5" cy="3.5" r="3.5" />
            <circle stroke="#007ADB" cx="60.5" cy="3.5" r="3.5" />
            <circle stroke="#9D5B96" cx="50.5" cy="3.5" r="3.5" />
            <circle stroke="#009E9B" cx="41.5" cy="3.5" r="3.5" />
            <circle stroke="#E8D977" cx="31.5" cy="3.5" r="3.5" />
            <circle stroke="#C08540" cx="21.5" cy="3.5" r="3.5" />
            <circle stroke="#B4AEAB" cx="12.5" cy="3.5" r="3.5" />
            <circle stroke="#E7DBDB" cx="3.5" cy="3.5" r="3.5" />
          </g>
        </svg>
        <canvas
          ref={canvasRef}
          width={screenWidth}
          height={screenHeight}
          style={{
            position: 'absolute',
            left: '11.5px',
            top: '27px',
            imageRendering: 'pixelated',
          }}
        />
      </div>
    </div>
  );
};

export default memo(SSD1306Node);
