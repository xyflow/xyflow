import { memo, useState, useRef, useCallback } from 'react';
import { Handle, Position, NodeProps, BuiltInNode } from '@xyflow/react';

const mmToPix = 3.7795275591;

const clamp = (min: number, max: number, value: number) => {
  return Math.min(Math.max(value, min), max);
};

const SlidePotentiometerNode = ({ id, data }: NodeProps<BuiltInNode>) => {
  const [travelLength] = useState((data?.travelLength as number) || 30);
  const [value, setValue] = useState((data?.value as number) || 0);
  const [min] = useState((data?.min as number) || 0);
  const [max] = useState((data?.max as number) || 100);
  const [step] = useState((data?.step as number) || 2);
  const [isPressed, setIsPressed] = useState(false);
  const sliderRef = useRef<SVGRectElement>(null);

  const pinInfo = [
    { name: 'VCC', x: 1, y: 43, number: 1, signals: [{ type: 'power', signal: 'VCC' }] },
    { name: 'SIG', x: 1, y: 63, number: 2, signals: [{ type: 'analog' }] },
    {
      name: 'GND',
      x: 93.6 + travelLength * mmToPix,
      y: 43,
      number: 3,
      signals: [{ type: 'power', signal: 'GND' }],
    },
  ];

  // Tip is centered by default
  const tipBaseOffsetX = -15;
  const tipMovementX = (value / (max - min)) * travelLength;
  const tipOffsetX = tipMovementX + tipBaseOffsetX;

  const updateValue = useCallback(
    (newValue: number) => {
      setValue(clamp(min, max, newValue));
    },
    [min, max]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent<SVGGElement>) => {
    setIsPressed(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isPressed || !sliderRef.current) return;

      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left;

      // Convert pixel position to value
      const caseBorderWidth = 7.5 * mmToPix;
      const tipPositionX = x - caseBorderWidth - 5 * mmToPix; // 5mm is the left padding
      const mmPerIncrement = (travelLength * mmToPix) / (max - min);
      const newValue = Math.round(tipPositionX / mmPerIncrement);
      updateValue(newValue);
    },
    [isPressed, travelLength, max, min, updateValue]
  );

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  return (
    <div
      style={{
        background: 'transparent',
        padding: 0,
        position: 'relative',
      }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Handles for pins */}
      {pinInfo.map((pin) => (
        <Handle
          key={`${id}-${pin.name}-source`}
          type="source"
          position={Position.Left}
          id={`${id}-${pin.name}-source`}
          style={{
            left: `${pin.x}px`,
            top: `${pin.y}px`,
            background: pin.name === 'GND' || pin.name === 'VCC' ? '#ff0072' : '#1a192b',
          }}
        />
      ))}
      {pinInfo.map((pin) => (
        <Handle
          key={`${id}-${pin.name}-target`}
          type="target"
          position={Position.Left}
          id={`${id}-${pin.name}-target`}
          style={{
            left: `${pin.x}px`,
            top: `${pin.y}px`,
            background: pin.name === 'GND' || pin.name === 'VCC' ? '#ff0072' : '#1a192b',
          }}
        />
      ))}

      <svg
        width={`${travelLength + 25}mm`}
        height="29mm"
        version="1.1"
        viewBox={`0 0 ${travelLength + 25} 29`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        onMouseMove={handleMouseMove}
      >
        <defs>
          <filter id={`outline-${id}`}>
            <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="#4faaff" />
          </filter>
          <linearGradient
            id={`tipGradient-${id}`}
            x1="36.482"
            x2="50.447"
            y1="91.25"
            y2="91.25"
            gradientTransform="matrix(.8593 0 0 1.1151 -14.849 -92.256)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1a1a1a" offset="0" />
            <stop stopColor="#595959" offset=".4" />
            <stop stopColor="#595959" offset=".6" />
            <stop stopColor="#1a1a1a" offset="1" />
          </linearGradient>
          <radialGradient
            id={`bodyGradient-${id}`}
            cx="62.59"
            cy="65.437"
            r="22.5"
            gradientTransform="matrix(1.9295 3.7154e-8 0 .49697 -98.268 -23.02)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#d2d2d2" offset="0" />
            <stop stopColor="#7a7a7a" offset="1" />
          </radialGradient>
          <g id={`screw-${id}`}>
            <circle cx="0" cy="0" r="1" fill="#858585" stroke="#000" strokeWidth=".05" />
            <path d="m0 1 0-2" fill="none" stroke="#000" strokeWidth=".151" />
          </g>
        </defs>
        {/* pins */}
        <g fill="#ccc">
          <rect x="0" y="11" width="5" height="0.75" />
          <rect x={travelLength + 20} y="11" width="5" height="0.75" />
          <rect x="0" y="16.25" width="5" height="0.75" />
        </g>
        <g transform="translate(5 5)">
          {/* Body */}
          <rect
            ref={sliderRef}
            x="0"
            y="5"
            width={travelLength + 15}
            height="9"
            rx=".2"
            ry=".2"
            fill={`url(#bodyGradient-${id})`}
            fillRule="evenodd"
          />
          <rect
            x="3.25"
            y="8"
            width={travelLength + 8.5}
            height="3"
            rx=".1"
            ry=".1"
            fill="#3f1e1e"
          />
          {/* Screw Left */}
          <g transform="translate(1.625 9.5) rotate(45)">
            <use xlinkHref={`#screw-${id}`} />
          </g>
          {/* Screw Right */}
          <g transform={`translate(${travelLength + 13.375} 9.5) rotate(45)`}>
            <use xlinkHref={`#screw-${id}`} />
          </g>
          {/* Tip */}
          <g
            transform={`translate(${tipOffsetX} 0)`}
            onMouseDown={handleMouseDown}
            style={{ cursor: 'pointer' }}
          >
            <rect x="19.75" y="8.6" width="5.5" height="1.8" />
            <rect
              x="16.5"
              y="0"
              width="12"
              height="19"
              fill={`url(#tipGradient-${id})`}
              strokeWidth="2.6518"
              rx=".1"
              ry=".1"
            />
            <rect x="22.2" y="0" width=".6" height="19" fill="#efefef" />
          </g>
        </g>
        <rect x="0" y="14" width="1" height="1" fill="none" />
      </svg>
    </div>
  );
};

export default memo(SlidePotentiometerNode);
