import { memo, useState, useRef } from 'react';
import { Handle, Position, NodeProps, BuiltInNode } from '@xyflow/react';

const knobCenter = {
  x: 9.91,
  y: 8.18,
};

const clamp = (min: number, max: number, value: number) => Math.min(Math.max(value, min), max);

const PotentiometerNode = memo(({ data }: NodeProps<BuiltInNode>) => {
  const [value, setValue] = useState((data.value as number) || 0);
  const min = (data.min as number) ?? 0;
  const max = (data.max as number) ?? 1023;
  const step = (data.step as number) ?? 1;
  const startDegree = (data.startDegree as number) ?? -135;
  const endDegree = (data.endDegree as number) ?? 135;

  const [pressed, setPressed] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const pinInfo = [
    { name: 'GND', x: 29, y: 68.5 },
    { name: 'SIG', x: 39, y: 68.5 },
    { name: 'VCC', x: 49, y: 68.5 },
  ];

  const mapToMinMax = (val: number, minVal: number, maxVal: number): number => {
    return val * (maxVal - minVal) + minVal;
  };

  const percentFromMinMax = (val: number, minVal: number, maxVal: number): number => {
    return (val - minVal) / (maxVal - minVal);
  };

  const percent = clamp(0, 1, percentFromMinMax(value, min, max));
  const knobDeg = (endDegree - startDegree) * percent + startDegree;

  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button === 0) {
      setPressed(true);
      event.stopPropagation();
      event.preventDefault();
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (pressed) {
      rotateHandler(event);
    }
  };

  const handleMouseUp = () => {
    setPressed(false);
  };

  const rotateHandler = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const svgX = event.clientX - rect.left;
    const svgY = event.clientY - rect.top;

    // Convert to SVG coordinate space
    const scale = 20 / rect.width;
    const localX = svgX * scale;
    const localY = svgY * scale;

    const x = knobCenter.x - localX;
    const y = knobCenter.y - localY;
    let deg = Math.round((Math.atan2(y, x) * 180) / Math.PI);
    if (deg < 0) {
      deg += 360;
    }

    deg -= 90;

    if (x > 0 && y <= 0 && deg > 0) {
      deg -= 360;
    }

    deg = clamp(startDegree, endDegree, deg);
    const newPercent = percentFromMinMax(deg, startDegree, endDegree);
    const newValue = mapToMinMax(newPercent, min, max);

    updateValue(newValue);
  };

  const updateValue = (newValue: number) => {
    const clamped = clamp(min, max, newValue);
    const updated = Math.round(clamped / step) * step;
    setValue(Math.round(updated * 100) / 100);
  };

  return (
    <div
      style={{
        background: 'transparent',
        position: 'relative',
        width: '75.6px', // 20mm converted to px
      }}
    >
      <svg
        ref={svgRef}
        width="20mm"
        height="20mm"
        viewBox="0 0 20 20"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: pressed ? 'grabbing' : 'grab' }}
      >
        <defs>
          <filter id="outline">
            <feDropShadow id="glow" dx="0" dy="0" stdDeviation="0.5" floodColor="cyan" />
          </filter>
        </defs>
        <rect
          x="0.15"
          y="0.15"
          width="19.5"
          height="19.5"
          ry="1.23"
          fill="#045881"
          stroke="#045881"
          strokeWidth="0.30"
        />
        <rect x="5.4" y="0.70" width="9.1" height="1.9" fill="#ccdae3" strokeWidth="0.15" />
        <ellipse
          id="knob"
          cx={knobCenter.x}
          cy={knobCenter.y}
          rx="7.27"
          ry="7.43"
          fill="#e4e8eb"
          strokeWidth="0.15"
        />
        <rect x="6" y="17" width="8" height="2" fillOpacity="0" stroke="#fff" strokeWidth="0.30" />
        <g strokeWidth="0.15">
          <text x="6.21" y="16.6" fontSize="1px" fill="#ffffff">GND</text>
          <text x="9.2" y="16.63" fontSize="1px" fill="#ffffff">SIG</text>
          <text x="11.5" y="16.59" fontSize="1px" fill="#ffffff">VCC</text>
        </g>
        <g fill="#fff" strokeWidth="0.15">
          <ellipse cx="1.68" cy="1.81" rx="0.99" ry="0.96" />
          <ellipse cx="1.48" cy="18.37" rx="0.99" ry="0.96" />
          <ellipse cx="17.97" cy="18.47" rx="0.99" ry="0.96" />
          <ellipse cx="18.07" cy="1.91" rx="0.99" ry="0.96" />
        </g>
        <g fill="#b3b1b0" strokeWidth="0.15">
          <ellipse cx="7.68" cy="18" rx="0.61" ry="0.63" />
          <ellipse cx="10.22" cy="18" rx="0.61" ry="0.63" />
          <ellipse cx="12.76" cy="18" rx="0.61" ry="0.63" />
        </g>
        <ellipse cx="9.95" cy="8.06" rx="6.60" ry="6.58" fill="#c3c2c3" strokeWidth="0.15" />
        <rect
          id="rotating"
          x="10"
          y="2"
          width="0.42"
          height="3.1"
          strokeWidth="0.15"
          style={{
            transformOrigin: '10px 8px',
            transform: `rotate(${knobDeg}deg)`,
          }}
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
            bottom: '-5px',
            width: '8px',
            height: '8px',
            background: pin.name === 'VCC' ? '#ff0072' : '#1a192b',
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
            bottom: '-5px',
            width: '8px',
            height: '8px',
            background: pin.name === 'VCC' ? '#ff0072' : '#1a192b',
            border: '2px solid #fff',
          }}
        />
      ))}
    </div>
  );
});

PotentiometerNode.displayName = 'PotentiometerNode';

export default PotentiometerNode;
