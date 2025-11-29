import { memo } from 'react';
import { Handle, Position, NodeProps, BuiltInNode } from '@xyflow/react';

const KS2EMDC5Node = ({ data }: NodeProps<BuiltInNode>) => {
  const y1Pos = 5.1;
  const y2Pos = 32.7;
  const x1Pos = 5.5;
  const x2Pos = 25;
  const x3Pos = 45;
  const x4Pos = 74;

  const pinInfo = [
    { name: 'NO2', x: x1Pos, y: y1Pos, number: 8, isPower: false, position: Position.Top },
    { name: 'NC2', x: x2Pos, y: y1Pos, number: 6, isPower: false, position: Position.Top },
    { name: 'P2', x: x3Pos, y: y1Pos, number: 4, isPower: false, position: Position.Top },
    { name: 'COIL2', x: x4Pos, y: y1Pos, number: 1, isPower: true, position: Position.Top },
    { name: 'NO1', x: x1Pos, y: y2Pos, number: 9, isPower: false, position: Position.Bottom },
    { name: 'NC1', x: x2Pos, y: y2Pos, number: 11, isPower: false, position: Position.Bottom },
    { name: 'P1', x: x3Pos, y: y2Pos, number: 13, isPower: false, position: Position.Bottom },
    { name: 'COIL1', x: x4Pos, y: y2Pos, number: 16, isPower: false, position: Position.Bottom },
  ];

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

      <svg
        width="21mm"
        height="10mm"
        version="1.1"
        viewBox="0 0 21 10"
        xmlns="http://www.w3.org/2000/svg"
        style={{ userSelect: 'none' }}
      >
        <g strokeWidth=".4" fill="#f7b93c" stroke="#dda137">
          <rect x=".20" y=".20" width="20.6" height="9.61" ry=".58" />
          <rect x="20.2" y="4.5" width=".40" height="1" fill="#dda137" />
        </g>
        <g fill="none" stroke="#dda137" strokeWidth=".47">
          <ellipse cx="1.6" cy="1.35" rx=".76" ry=".76" />
          <ellipse cx="6.68" cy="1.35" rx=".76" ry=".76" />
          <ellipse cx="11.76" cy="1.35" rx=".76" ry=".76" />
          <ellipse cx="19.38" cy="1.35" rx=".76" ry=".76" />
          <ellipse cx="1.6" cy="8.65" rx=".76" ry=".76" />
          <ellipse cx="6.68" cy="8.65" rx=".76" ry=".76" />
          <ellipse cx="11.76" cy="8.65" rx=".76" ry=".76" />
          <ellipse cx="19.38" cy="8.65" rx=".76" ry=".76" />
        </g>
        <text fill="#4a3510" fontFamily="sans-serif" fontSize="2.8222px">
          <tspan x="1.07" y="6.03">KS2E-M-DC5</tspan>
        </text>
      </svg>
    </div>
  );
};

KS2EMDC5Node.displayName = 'KS2EMDC5Node';

export default memo(KS2EMDC5Node);
