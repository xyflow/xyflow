import { memo, useState, useId } from 'react';
import { Handle, Position, NodeProps, BuiltInNode } from '@xyflow/react';

const Pushbutton6mmNode = memo(({ data }: NodeProps<BuiltInNode>) => {
  const [pressed, setPressed] = useState(false);
  const color = (data.color as string) || 'red';
  const label = (data.label as string) || '';
  const xray = (data.xray as boolean) ?? false;
  const uniqueId = useId();

  const pinInfo = [
    { name: '1.l', x: 0, y: 2.2, position: Position.Left },
    { name: '2.l', x: 0, y: 21, position: Position.Left },
    { name: '1.r', x: 28, y: 2.2, position: Position.Right },
    { name: '2.r', x: 28, y: 21, position: Position.Right },
  ];

  const buttonFill = pressed ? `url(#grad-down-${uniqueId})` : `url(#grad-up-${uniqueId})`;

  const handleMouseDown = () => {
    setPressed(true);
  };

  const handleMouseUp = () => {
    setPressed(false);
  };

  return (
    <div
      style={{
        background: 'transparent',
        position: 'relative',
        width: '28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <button
        style={{
          border: 'none',
          background: 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        <svg
          width="7.4129977mm"
          height="6mm"
          viewBox="-3 0 7.4954476 6"
        >
          <defs>
            <linearGradient id={`grad-up-${uniqueId}`} x1="0" x2="1" y1="0" y2="1">
              <stop stopColor="#ffffff" offset="0" />
              <stop stopColor={color} offset="0.3" />
              <stop stopColor={color} offset="0.5" />
              <stop offset="1" />
            </linearGradient>
            <linearGradient
              id={`grad-down-${uniqueId}`}
              x1="9.8219995"
              x2="2.178"
              y1="9.8219995"
              y2="2.178"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#ffffff" offset="0" />
              <stop stopColor={color} offset="0.3" />
              <stop stopColor={color} offset="0.5" />
              <stop offset="1" />
            </linearGradient>
          </defs>
          <rect
            x="-2.2698734"
            y="-0.033367086"
            width="6.0667338"
            height="6.0667338"
            rx="0.22244692"
            ry="0.22244692"
            fill="#464646"
            style={{ strokeWidth: 0.505561 }}
          />
          <rect
            x="-1.8907025"
            y="0.3458038"
            width="5.3083925"
            height="5.3083925"
            rx="0.1066734"
            ry="0.1066734"
            fill="#eaeaea"
            style={{ strokeWidth: 0.505561 }}
          />
          <g
            className="clickable-element"
            transform="matrix(0.50556117,0,0,0.50556117,-2.2698734,-0.03336708)"
          >
            <circle cx="6" cy="6" r="3.822" fill={buttonFill} />
            <circle
              className="button-active-circle"
              cx="6"
              cy="6"
              r="3.822"
              fill={`url(#grad-down-${uniqueId})`}
              style={{ opacity: pressed ? 1 : 0 }}
            />
            <circle
              cx="6"
              cy="6"
              r="2.9"
              fill={color}
              stroke="#2f2f2f"
              strokeOpacity="0.47"
              strokeWidth="0.08"
            />
            <rect
              style={{ fill: '#b3b3b3', strokeWidth: 1.72987 }}
              width="1.455145"
              height="0.85429525"
              x="-1.4441905"
              y="0.59993488"
              rx="0.014974313"
            />
            {xray && (
              <>
                <rect
                  style={{ opacity: 0.3, fill: '#b3b3b3', strokeWidth: 3.86235 }}
                  width="12.124171"
                  height="0.51113945"
                  x="-0.047361366"
                  y="0.90351838"
                  rx="0.12476496"
                />
                <rect
                  style={{ opacity: 0.3, fill: '#b3b3b3', strokeWidth: 3.86235 }}
                  width="12.124171"
                  height="0.51113945"
                  x="-0.098103404"
                  y="10.614529"
                  rx="0.12476496"
                />
              </>
            )}
            <rect
              style={{ fill: '#b3b3b3', strokeWidth: 1.69238 }}
              width="1.3927531"
              height="0.85429525"
              x="-1.3971666"
              y="10.694777"
              rx="0.014332262"
            />
            <rect
              style={{ fill: '#b3b3b3', strokeWidth: 1.69238 }}
              width="1.3927531"
              height="0.85429525"
              x="11.989052"
              y="0.59516686"
              rx="0.014332262"
            />
            <rect
              style={{ fill: '#b3b3b3', strokeWidth: 1.69238 }}
              width="1.3927531"
              height="0.85429525"
              x="11.985411"
              y="10.744086"
              rx="0.014332262"
            />
          </g>
        </svg>
      </button>
      {label && (
        <span
          style={{
            fontSize: '12px',
            textAlign: 'center',
            color: 'gray',
            lineHeight: 1,
            marginTop: '2px',
          }}
        >
          {label}
        </span>
      )}

      {/* Handles for pins */}
      {pinInfo.map((pin, index) => (
        <Handle
          key={`${pin.name}-source-${index}`}
          type="source"
          position={pin.position}
          id={`${pin.name}-source`}
          style={{
            left: pin.position === Position.Left ? `${pin.x}px` : `${pin.x - 7}px`,
            top: `${pin.y}px`,
            width: '8px',
            height: '8px',
            background: '#1a192b',
            border: '2px solid #fff',
          }}
        />
      ))}
      {pinInfo.map((pin, index) => (
        <Handle
          key={`${pin.name}-target-${index}`}
          type="target"
          position={pin.position}
          id={`${pin.name}-target`}
          style={{
            left: pin.position === Position.Left ? `${pin.x}px` : `${pin.x - 7}px`,
            top: `${pin.y}px`,
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

Pushbutton6mmNode.displayName = 'Pushbutton6mmNode';

export default Pushbutton6mmNode;
