import { memo, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps, BuiltInNode } from '@xyflow/react';

const ILI9341Node = ({ data }: NodeProps<BuiltInNode>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const screenWidth = 240;
  const screenHeight = 320;
  const flipHorizontal = (data.flipHorizontal as boolean) || false;
  const flipVertical = (data.flipVertical as boolean) || false;

  const pinInfo = [
    { name: 'VCC', x: 48.3, y: 287.2, number: 1, isPower: true, position: Position.Bottom },
    { name: 'GND', x: 57.9012, y: 287.2, number: 2, isPower: true, position: Position.Bottom },
    { name: 'CS', x: 67.5024, y: 287.2, number: 3, isPower: false, position: Position.Bottom },
    { name: 'RST', x: 77.1036, y: 287.2, number: 4, isPower: false, position: Position.Bottom },
    { name: 'D/C', x: 86.7048, y: 287.2, number: 5, isPower: false, position: Position.Bottom },
    { name: 'MOSI', x: 96.306, y: 287.2, number: 6, isPower: false, position: Position.Bottom },
    { name: 'SCK', x: 105.9072, y: 287.2, number: 7, isPower: false, position: Position.Bottom },
    { name: 'LED', x: 115.5084, y: 287.2, number: 8, isPower: false, position: Position.Bottom },
    { name: 'MISO', x: 125.1096, y: 287.2, number: 9, isPower: false, position: Position.Bottom },
  ];

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Initialize with black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, screenWidth, screenHeight);
      }
    }
  }, []);

  const flip = flipHorizontal || flipVertical;
  const scaleX = flipHorizontal ? -1 : 1;
  const scaleY = flipVertical ? -1 : 1;
  const canvasTransform = flip ? `scaleX(${scaleX}) scaleY(${scaleY})` : '';

  return (
    <div style={{ position: 'relative' }}>
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

      <div style={{ position: 'relative' }}>
        <svg
          width="46.5mm"
          height="77.6mm"
          version="1.1"
          viewBox="0 0 46.5 77.6"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          style={{ userSelect: 'none' }}
        >
          {/* Board */}
          <path
            d="m8.8e-7 3.37e-6v77.6h46.5v-77.6zm43.1 1.78a1.8 1.8 0 0 1 1.8 1.8 1.8 1.8 0 0 1-1.8 1.8 1.8 1.8 0 0 1-1.8-1.8 1.8 1.8 0 0 1 1.8-1.8zm-39.4 0.0946a1.8 1.8 0 0 1 1.8 1.8 1.8 1.8 0 0 1-1.8 1.8 1.8 1.8 0 0 1-1.8-1.8 1.8 1.8 0 0 1 1.8-1.8zm0 70.7a1.8 1.8 0 0 1 1.8 1.8 1.8 1.8 0 0 1-1.8 1.8 1.8 1.8 0 0 1-1.8-1.8 1.8 1.8 0 0 1 1.8-1.8zm39.4 0.0946a1.8 1.8 0 0 1 1.8 1.8 1.8 1.8 0 0 1-1.8 1.8 1.8 1.8 0 0 1-1.8-1.8 1.8 1.8 0 0 1 1.8-1.8zm-31 2.68h1.41v1.34h-1.41zm2.53 0h1.41v1.34h-1.41zm2.56 0h1.41v1.34h-1.41zm2.54 0h1.41v1.34h-1.41zm12.7 0h1.41v1.34h-1.41zm-10.1 0.0119h1.41v1.34h-1.41zm2.54 0.0119h1.41v1.34h-1.41zm5.08 0h1.41v1.34h-1.41zm-2.53 0.0114h1.41v1.34h-1.41z"
            fill="#931917"
            strokeWidth="0"
          />

          {/* LCD Panel */}
          <path d="m0.17 5.65v64.6h46.1v-64.6zm6.46 62.9h34.7v1.7h-34.7z" fill="#f6e1f1" />
          <rect
            x="11.2"
            y="66.7"
            width="24.2"
            height="6.24"
            rx="1"
            ry="1"
            fill="#bdab16"
            opacity=".4"
          />
          <rect x="1.62" y="6.79" width="43.3" height="61.9" />
          <rect
            x="10.8"
            y="74.6"
            width="24.2"
            height="2.83"
            fill="none"
            stroke="#fff"
            strokeWidth=".27"
          />

          {/* Pins */}
          <g fill="#ccc">
            <path d="m11.8 75v1.99h1.98v-1.99zm0.988 0.397a0.6 0.6 0 0 1 0.0041 0 0.6 0.6 0 0 1 0.6 0.6 0.6 0.6 0 0 1-0.6 0.6 0.6 0.6 0 0 1-0.6-0.6 0.6 0.6 0 0 1 0.596-0.6z" />
            <path
              id="round-pin"
              d="m15.3 75a1 1 0 0 0-0.987 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1 1 1 0 0 0-1-1 1 1 0 0 0-0.0134 0zm0.0093 0.4a0.6 0.6 0 0 1 0.0041 0 0.6 0.6 0 0 1 0.6 0.6 0.6 0.6 0 0 1-0.6 0.6 0.6 0.6 0 0 1-0.6-0.6 0.6 0.6 0 0 1 0.596-0.6z"
            />
            <use xlinkHref="#round-pin" x="2.54" />
            <use xlinkHref="#round-pin" x="5.08" />
            <use xlinkHref="#round-pin" x="7.62" />
            <use xlinkHref="#round-pin" x="10.16" />
            <use xlinkHref="#round-pin" x="12.7" />
            <use xlinkHref="#round-pin" x="15.24" />
            <use xlinkHref="#round-pin" x="17.78" />
          </g>
          <text fontFamily="monospace" fontSize="3.5px" fill="#fff">
            <tspan x="8.2" y="76.9">1</tspan>
            <tspan x="35.6" y="76.9">9</tspan>
            <tspan x="14.2" y="4.3" fontSize="4.6px">ILI9341</tspan>
          </text>
        </svg>

        {/* Canvas overlay for display */}
        <canvas
          ref={canvasRef}
          width={screenWidth}
          height={screenHeight}
          style={{
            position: 'absolute',
            left: '8px',
            top: '28px',
            width: '159px',
            height: '212px',
            imageRendering: 'pixelated',
            transform: canvasTransform,
          }}
        />
      </div>
    </div>
  );
};

ILI9341Node.displayName = 'ILI9341Node';

export default memo(ILI9341Node);
