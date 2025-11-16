import { memo, useState, useId } from 'react';
import { Handle, Position, NodeProps, BuiltInNode } from '@xyflow/react';

const PushbuttonNode = memo(({ data, id }: NodeProps<BuiltInNode>) => {
  const [pressed, setPressed] = useState(false);
  const [sticky, setSticky] = useState(false);
  const color = (data.color as string) || 'red';
  const label = (data.label as string) || '';
  const xray = (data.xray as boolean) ?? false;
  const uniqueId = useId();

  const pinInfo = [
    { name: '1.l', x: 0, y: 13, position: Position.Left },
    { name: '2.l', x: 0, y: 32, position: Position.Left },
    { name: '1.r', x: 67, y: 13, position: Position.Right },
    { name: '2.r', x: 67, y: 32, position: Position.Right },
  ];

  const buttonFill = pressed ? `url(#grad-down-${uniqueId})` : `url(#grad-up-${uniqueId})`;

  const handleMouseDown = () => {
    console.log('🖱️ PushbuttonNode: handleMouseDown called! pressed:', pressed, 'id:', id);
    if (!pressed) {
      setPressed(true);
      // Dispatch button press event
      console.log('🎯 PushbuttonNode: Dispatching button-press event for node:', id);
      window.dispatchEvent(
        new CustomEvent('button-press', {
          detail: { nodeId: id },
        })
      );
    } else {
      console.log('⚠️ Button already pressed, ignoring');
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!pressed) {
      return;
    }
    if (e.ctrlKey || e.metaKey) {
      setSticky(true);
    } else {
      setSticky(false);
      setPressed(false);
      // Dispatch button release event
      console.log('🎯 PushbuttonNode: Dispatching button-release event for node:', id);
      window.dispatchEvent(
        new CustomEvent('button-release', {
          detail: { nodeId: id },
        })
      );
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!sticky) {
      handleMouseUp(e);
    }
  };

  return (
    <div
      style={{
        background: 'transparent',
        position: 'relative',
        width: '67px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <button
        className="nodrag nopan"
        style={{
          border: 'none',
          background: 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
          pointerEvents: 'auto',
        }}
        onMouseDown={(e) => {
          console.log('🖱️ Button element clicked!');
          e.stopPropagation();
          handleMouseDown();
        }}
        onMouseUp={(e) => {
          console.log('🖱️ Button element released!');
          e.stopPropagation();
          handleMouseUp(e);
        }}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        <svg
          width="17.802mm"
          height="12mm"
          viewBox="-3 0 18 12"
        >
          <defs>
            <linearGradient id={`grad-up-${uniqueId}`} x1="0" x2="1" y1="0" y2="1">
              <stop stopColor="#ffffff" offset="0" />
              <stop stopColor={color} offset="0.3" />
              <stop stopColor={color} offset="0.5" />
              <stop offset="1" />
            </linearGradient>
            <linearGradient id={`grad-down-${uniqueId}`} x1="1" x2="0" y1="1" y2="0">
              <stop stopColor="#ffffff" offset="0" />
              <stop stopColor={color} offset="0.3" />
              <stop stopColor={color} offset="0.5" />
              <stop offset="1" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="12" height="12" rx="0.44" ry="0.44" fill="#464646" />
          <rect x="0.75" y="0.75" width="10.5" height="10.5" rx="0.211" ry="0.211" fill="#eaeaea" />
          {xray && (
            <>
              <rect
                style={{ opacity: 0.3, fill: '#999999', strokeWidth: 0.563001 }}
                width="12.087865"
                height="1.0371729"
                x="-0.00075517414"
                y="2.9106798"
              />
              <rect
                style={{ opacity: 0.3, fill: '#999999', strokeWidth: 0.534365 }}
                width="12.087865"
                height="0.93434691"
                x="-0.071111664"
                y="8.0458994"
              />
            </>
          )}
          <g fill="#1b1b1">
            <circle cx="1.767" cy="1.7916" r="0.37" />
            <circle cx="10.161" cy="1.7916" r="0.37" />
            <circle cx="10.161" cy="10.197" r="0.37" />
            <circle cx="1.767" cy="10.197" r="0.37" />
          </g>
          <g fill="#999" strokeWidth="1.0154">
            <path
              d="m12.365 2.426c0.06012 0 0.10849 0.0469 0.1085 0.10522v0.38698h2.2173c0.12023 0 0.217 0.0938 0.217 0.21045v0.50721c0 0.1166-0.09677 0.21045-0.217 0.21045h-2.2173v0.40101c0 0.0583-0.0484 0.10528-0.1085 0.10528h-0.36835v-1.9266z"
            />
            <path
              d="m12.365 7.5c0.06012 0 0.10849 0.0469 0.1085 0.10522v0.38698h2.2173c0.12023 0 0.217 0.0938 0.217 0.21045v0.50721c0 0.1166-0.09677 0.21045-0.217 0.21045h-2.2173v0.40101c0 0.0583-0.0484 0.10528-0.1085 0.10528h-0.36835v-1.9266z"
            />
            <path
              d="m-0.35085 4.3526c-0.06012 0-0.10849-0.0469-0.1085-0.10522v-0.38698h-2.2173c-0.12023 0-0.217-0.0938-0.217-0.21045v-0.50721c0-0.1166 0.09677-0.21045 0.217-0.21045h2.2173v-0.40101c0-0.0583 0.0484-0.10528 0.1085-0.10528h0.36835v1.9266z"
            />
            <path
              d="m-0.35085 9.4266c-0.06012 0-0.10849-0.0469-0.1085-0.10522v-0.38698h-2.2173c-0.12023 0-0.217-0.0938-0.217-0.21045v-0.50721c0-0.1166 0.09677-0.21045 0.217-0.21045h2.2173v-0.40101c0-0.0583 0.0484-0.10528 0.1085-0.10528h0.36835v1.9266z"
            />
          </g>
          <g className="clickable-element">
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

PushbuttonNode.displayName = 'PushbuttonNode';

export default PushbuttonNode;
