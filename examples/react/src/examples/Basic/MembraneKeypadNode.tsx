import { memo, useState } from 'react';
import { Handle, Position, NodeProps, BuiltInNode } from '@xyflow/react';

const rowPositions = [10.7, 25, 39.3, 53.6];
const columnPositions = [7, 22, 37, 52];

function isNumeric(text: string) {
  return !isNaN(parseFloat(text));
}

const MembraneKeypadNode = memo(({ data }: NodeProps<BuiltInNode>) => {
  const columns = (data.columns as '3' | '4') || '4';
  const connector = (data.connector as boolean) ?? false;
  const keys = (data.keys as string[]) || [
    '1', '2', '3', 'A',
    '4', '5', '6', 'B',
    '7', '8', '9', 'C',
    '*', '0', '#', 'D',
  ];

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const getPinInfo = () => {
    switch (columns) {
      case '3':
        return [
          { name: 'R1', x: 76.5, y: 338 },
          { name: 'R2', x: 86, y: 338 },
          { name: 'R3', x: 95.75, y: 338 },
          { name: 'R4', x: 105.25, y: 338 },
          { name: 'C1', x: 115, y: 338 },
          { name: 'C2', x: 124.5, y: 338 },
          { name: 'C3', x: 134, y: 338 },
        ];
      default:
        return [
          { name: 'R1', x: 100, y: 338 },
          { name: 'R2', x: 110, y: 338 },
          { name: 'R3', x: 119.5, y: 338 },
          { name: 'R4', x: 129, y: 338 },
          { name: 'C1', x: 138.5, y: 338 },
          { name: 'C2', x: 148, y: 338 },
          { name: 'C3', x: 157.75, y: 338 },
          { name: 'C4', x: 167.5, y: 338 },
        ];
    }
  };

  const pinInfo = getPinInfo();
  const fourColumns = columns === '4';
  const columnWidth = 15;
  const pinWidth = 2.54;
  const width = fourColumns ? 70.336 : 70.336 - columnWidth;
  const connectorWidth = fourColumns ? pinWidth * 8 : pinWidth * 7;
  const height = 76 + (connector ? 15 : 0);

  const handleKeyDown = (text: string) => {
    setPressedKeys((prev) => new Set(prev).add(text));
  };

  const handleKeyUp = (text: string) => {
    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.delete(text);
      return next;
    });
  };

  const renderKey = (row: number, column: number) => {
    const text = keys[row * 4 + column] ?? '';
    const isPressed = pressedKeys.has(text);
    const keyClass = isNumeric(text) ? 'blue-key' : 'red-key';
    const defaultFill = isNumeric(text) ? '#4e90d7' : '#e94541';
    const pressedFill = isNumeric(text) ? '#4e50d7' : '#ab040b';

    return (
      <g
        key={`${row}-${column}`}
        transform={`translate(${columnPositions[column]} ${rowPositions[row]})`}
        className={keyClass}
        onMouseDown={() => handleKeyDown(text)}
        onMouseUp={() => handleKeyUp(text)}
        onMouseLeave={() => handleKeyUp(text)}
        style={{ cursor: 'pointer' }}
      >
        <rect
          width="11.2"
          height="11"
          rx="1.4"
          ry="1.4"
          stroke="#b1b5b9"
          strokeWidth="0.75"
          fill={isPressed ? pressedFill : defaultFill}
        />
        <text
          x="5.6"
          y="8.1"
          fill={isPressed ? 'white' : '#dfe2e5'}
          fontSize="8.2px"
          textAnchor="middle"
          fontFamily="sans-serif"
          style={{ userSelect: 'none' }}
        >
          {text}
        </text>
      </g>
    );
  };

  return (
    <div
      style={{
        background: 'transparent',
        position: 'relative',
        width: `${width * 3.7795}px`, // mm to px conversion
      }}
    >
      <svg
        width={`${width}mm`}
        height={`${height}mm`}
        viewBox={`0 0 ${width} ${height}`}
        fontFamily="sans-serif"
        fontSize="8.2px"
        textAnchor="middle"
      >
        <defs>
          <pattern id="wires" width="2.54" height="8" patternUnits="userSpaceOnUse">
            <rect width="2.54" height="8" fill="#eee" />
            <rect x="0.77" width="1" height="6" fill="#d9d5bc" />
            <circle cx="1.27" cy="6" r="0.75" fill="#d9d5bc" />
            <rect x="0.52" y="6" width="1.5" height="2" fill="#d9d5bc" />
          </pattern>
          <pattern id="wires-marks" width="2.54" height="8" patternUnits="userSpaceOnUse">
            <rect x="0.52" y="6" width="1.5" height="2" fill="#746d41" />
          </pattern>
          <pattern id="pins-female" width="2.54" height="2.54" patternUnits="userSpaceOnUse">
            <circle cx="1.27" cy="1.27" r="1" fill="#111" />
          </pattern>
        </defs>

        {/* Keypad outline */}
        <rect x="0" y="0" width={width} height="76" rx="5" ry="5" fill="#454449" />
        <rect
          x="2.78"
          y="3.25"
          width={fourColumns ? 65 : 65 - columnWidth}
          height="68.6"
          rx="3.5"
          ry="3.5"
          fill="none"
          stroke="#b1b5b9"
          strokeWidth="1"
        />

        {/* Connector */}
        {connector && (
          <g transform={`translate(${(width - connectorWidth) / 2}, 76)`}>
            <rect width={connectorWidth} height="8" fill="url(#wires)" />
            <rect width="10.16" height="8" fill="url(#wires-marks)" />
            <rect y="8" width={connectorWidth} height="7" fill="#333" />
            <rect transform="translate(0, 12)" width={connectorWidth} height="2.54" fill="url(#pins-female)" />
          </g>
        )}

        {/* Blue keys */}
        <g>
          {renderKey(0, 0)}
          {renderKey(0, 1)}
          {renderKey(0, 2)}
          {renderKey(1, 0)}
          {renderKey(1, 1)}
          {renderKey(1, 2)}
          {renderKey(2, 0)}
          {renderKey(2, 1)}
          {renderKey(2, 2)}
          {renderKey(3, 1)}
        </g>

        {/* Red keys */}
        <g>
          {renderKey(3, 0)}
          {renderKey(3, 2)}
          {fourColumns && (
            <>
              {renderKey(0, 3)}
              {renderKey(1, 3)}
              {renderKey(2, 3)}
              {renderKey(3, 3)}
            </>
          )}
        </g>
      </svg>

      {/* Handles for pins */}
      {connector && pinInfo.map((pin, index) => (
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
            background: '#1a192b',
            border: '2px solid #fff',
          }}
        />
      ))}
      {connector && pinInfo.map((pin, index) => (
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
            background: '#1a192b',
            border: '2px solid #fff',
          }}
        />
      ))}
    </div>
  );
});

MembraneKeypadNode.displayName = 'MembraneKeypadNode';

export default MembraneKeypadNode;
