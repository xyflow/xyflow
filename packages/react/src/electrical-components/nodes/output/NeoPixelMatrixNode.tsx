import { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps, BuiltInNode } from '@xyflow/react';

const pixelWidth = 5.66;
const pixelHeight = 5;
const mmToPix = 3.7795275591; // mm to px conversion

interface RGB {
  r: number;
  g: number;
  b: number;
}

const NeoPixelMatrixNode = memo(({ data }: NodeProps<BuiltInNode>) => {
  const rows = (data.rows as number) || 8;
  const cols = (data.cols as number) || 8;
  const rowSpacing = (data.rowSpacing as number) || 1;
  const colSpacing = (data.colSpacing as number) || 1;
  const blurLight = (data.blurLight as boolean) ?? false;
  const animation = (data.animation as boolean) ?? false;

  const [pixels, setPixels] = useState<RGB[][]>(
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ r: 0, g: 0, b: 0 })))
  );

  const animationFrameRef = useRef<number | null>(null);

  const getPinInfo = () => {
    const pinSpacing = 2.54;
    const p = pinSpacing * mmToPix;
    const cx = ((cols * (colSpacing + pixelWidth)) / 2) * mmToPix;
    const y = rows * (rowSpacing + pixelHeight) * mmToPix;

    return [
      { name: 'GND', x: cx - 1.5 * p, y },
      { name: 'VCC', x: cx - 0.5 * p, y },
      { name: 'DIN', x: cx + 0.5 * p, y },
      { name: 'DOUT', x: cx + 1.5 * p, y },
    ];
  };

  const pinInfo = getPinInfo();
  const patWidth = pixelWidth + colSpacing;
  const patHeight = pixelHeight + rowSpacing;
  const width = pixelWidth * cols + colSpacing * (cols - 1);
  const height = pixelHeight * rows + rowSpacing * (rows - 1);

  const getPixelStyle = (rgb: RGB) => {
    const { r, g, b } = rgb;
    const spotOpacity = (value: number) => (value > 0.001 ? 0.7 + value * 0.3 : 0);
    const maxOpacity = Math.max(r, g, b);
    const minOpacity = Math.min(r, g, b);
    const opacityDelta = maxOpacity - minOpacity;
    const multiplier = Math.max(1, 2 - opacityDelta * 20);
    const glowBase = 0.1 + Math.max(maxOpacity * 2 - opacityDelta * 5, 0);
    const glowColor = (value: number) => (value > 0.005 ? 0.1 + value * 0.9 : 0);
    const glowOpacity = (value: number) => (value > 0.005 ? glowBase + value * (1 - glowBase) : 0);
    const cssVal = (value: number) =>
      maxOpacity ? Math.floor(Math.min(glowColor(value / maxOpacity) * multiplier, 1) * 255) : 255;
    const cssColor = `rgb(${cssVal(r)}, ${cssVal(g)}, ${cssVal(b)})`;

    return {
      rOpacity: spotOpacity(r),
      gOpacity: spotOpacity(g),
      bOpacity: spotOpacity(b),
      glowOpacity: glowOpacity(maxOpacity),
      glowColor: cssColor,
    };
  };

  useEffect(() => {
    if (animation) {
      const animateStep = () => {
        const time = new Date().getTime();
        const pixelValue = (n: number) =>
          n % 2000 > 1000 ? 1 - (n % 1000) / 1000 : (n % 1000) / 1000;

        setPixels((prevPixels) =>
          prevPixels.map((row, rowIndex) =>
            row.map((_, colIndex) => {
              const radius = Math.sqrt(
                (rowIndex - rows / 2 + 0.5) ** 2 + (colIndex - cols / 2 + 0.5) ** 2
              );
              return {
                r: pixelValue(radius * 100 + time),
                g: pixelValue(radius * 100 + time + 200),
                b: pixelValue(radius * 100 + time + 400),
              };
            })
          )
        );

        animationFrameRef.current = requestAnimationFrame(animateStep);
      };

      animationFrameRef.current = requestAnimationFrame(animateStep);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [animation, rows, cols]);

  return (
    <div
      style={{
        background: 'transparent',
        position: 'relative',
        width: `${width * mmToPix}px`,
      }}
    >
      <svg width={`${width}mm`} height={`${height}mm`} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <filter id="blurLight" x="-0.8" y="-0.8" height="2.8" width="2.8">
            <feGaussianBlur stdDeviation="0.3" />
          </filter>

          <pattern id="pixel" width={patWidth} height={patHeight} patternUnits="userSpaceOnUse">
            <rect x="0.33308" y="0" width="5" height="5" fill="#fff" />
            <rect x="0.016709" y="0.4279" width="0.35114" height="0.9" fill="#eaeaea" />
            <rect x="0" y="3.6518" width="0.35114" height="0.9" fill="#eaeaea" />
            <rect x="5.312" y="3.6351" width="0.35114" height="0.9" fill="#eaeaea" />
            <rect x="5.312" y="0.3945" width="0.35114" height="0.9" fill="#eaeaea" />
            <circle cx="2.8331" cy="2.5" r="2.1" fill="#ddd" />
            <circle cx="2.8331" cy="2.5" r="1.7325" fill="#e6e6e6" />
            <g fill="#bfbfbf">
              <path d="m4.3488 3.3308s-0.0889-0.087-0.0889-0.1341c0-0.047-6e-3 -1.1533-6e-3 -1.1533s-0.0591-0.1772-0.2008-0.1772c-0.14174 0-0.81501 0.012-0.81501 0.012s-0.24805 0.024-0.23624 0.3071c0.0118 0.2835 0.032 2.0345 0.032 2.0345 0.54707-0.046 1.0487-0.3494 1.3146-0.8888z" />
              <path d="m4.34 1.6405h-1.0805s-0.24325 0.019-0.26204-0.2423l6e-3 -0.6241c0.57782 0.075 1.0332 0.3696 1.3366 0.8706z" />
              <path d="m2.7778 2.6103-0.17127 0.124-0.8091-0.012c-0.17122-0.019-0.17062-0.2078-0.17062-0.2078-1e-3 -0.3746 1e-3 -0.2831-9e-3 -0.8122l-0.31248-0.018s0.43453-0.9216 1.4786-0.9174c-1.1e-4 0.6144-4e-3 1.2289-6e-3 1.8434z" />
              <path d="m2.7808 3.0828-0.0915-0.095h-0.96857l-0.0915 0.1447-3e-3 0.1127c0 0.065-0.12108 0.08-0.12108 0.08h-0.20909c0.55906 0.9376 1.4867 0.9155 1.4867 0.9155 1e-3 -0.3845-2e-3 -0.7692-2e-3 -1.1537z" />
            </g>
            <path
              d="m4.053 1.8619c-0.14174 0-0.81494 0.013-0.81494 0.013s-0.24797 0.024-0.23616 0.3084c3e-3 0.077 5e-3 0.3235 9e-3 0.5514h1.247c-2e-3 -0.33-4e-3 -0.6942-4e-3 -0.6942s-0.0593-0.1781-0.20102-0.1781z"
              fill="#666"
            />
          </pattern>
        </defs>

        <rect width={width} height={height} fill="url(#pixel)" />

        <g style={blurLight ? { filter: 'url(#blurLight)' } : {}}>
          {pixels.map((row, rowIndex) =>
            row.map((pixel, colIndex) => {
              const style = getPixelStyle(pixel);
              return (
                <g
                  key={`${rowIndex}-${colIndex}`}
                  transform={`translate(${patWidth * colIndex}, ${patHeight * rowIndex})`}
                  className="pixel"
                >
                  <ellipse cx="2.5" cy="2.3" rx="0.3" ry="0.3" fill="red" opacity={style.rOpacity} />
                  <ellipse
                    cx="3.5"
                    cy="3.2"
                    rx="0.3"
                    ry="0.3"
                    fill="green"
                    opacity={style.gOpacity}
                  />
                  <ellipse
                    cx="3.3"
                    cy="1.45"
                    rx="0.3"
                    ry="0.3"
                    fill="blue"
                    opacity={style.bOpacity}
                  />
                  <ellipse
                    cx="3"
                    cy="2.5"
                    rx="2.2"
                    ry="2.2"
                    opacity={style.glowOpacity}
                    fill={style.glowColor}
                  />
                </g>
              );
            })
          )}
        </g>
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

NeoPixelMatrixNode.displayName = 'NeoPixelMatrixNode';

export default NeoPixelMatrixNode;
