import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps, BuiltInNode } from '@xyflow/react';

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const RotaryDialerNode = ({ id }: NodeProps<BuiltInNode>) => {
  const [digit, setDigit] = useState<Digit | ''>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [angle, setAngle] = useState(0);

  const pinInfo = [
    { name: 'GND', x: 122, y: 286, signals: [] },
    { name: 'DIAL', x: 131.6, y: 286, signals: [] },
    { name: 'PULSE', x: 141.2, y: 286, signals: [] },
  ];

  const degrees = [320, 56, 87, 115, 143, 173, 204, 232, 260, 290];

  const dial = useCallback((selectedDigit: Digit) => {
    setDigit(selectedDigit);
    setIsAnimating(true);
    setAngle(degrees[selectedDigit]);

    // Reset after animation completes (1000ms)
    setTimeout(() => {
      setIsAnimating(false);
      setAngle(0);
    }, 1000);
  }, []);

  return (
    <div
      style={{
        background: 'transparent',
        padding: 0,
        position: 'relative',
      }}
    >
      {/* Handles for pins */}
      {pinInfo.map((pin, idx) => (
        <Handle
          key={`${id}-${pin.name}`}
          type="source"
          position={Position.Bottom}
          id={`${id}-${pin.name}-source`}
          style={{
            left: `${pin.x}px`,
            top: `${pin.y}px`,
            background: pin.name === 'GND' ? '#ff0072' : '#1a192b',
          }}
        />
      ))}
      {pinInfo.map((pin, idx) => (
        <Handle
          key={`${id}-${pin.name}-target`}
          type="target"
          position={Position.Bottom}
          id={`${id}-${pin.name}-target`}
          style={{
            left: `${pin.x}px`,
            top: `${pin.y}px`,
            background: pin.name === 'GND' ? '#ff0072' : '#1a192b',
          }}
        />
      ))}

      <svg width="266" height="286" xmlns="http://www.w3.org/2000/svg">
        {/* Pins */}
        <g fill="#9f9f9f" strokeWidth=".987">
          <path d="m123.4 266c0-0.377-0.149-0.739-0.416-1.01-0.268-0.267-0.629-0.417-1.01-0.417-0.377 0-0.739 0.15-1.01 0.417s-0.417 0.629-0.417 1.01v25.8c0 0.231 0.188 0.419 0.418 0.419h2.01c0.231 0 0.418-0.188 0.418-0.419v-25.8z" />
          <path d="m133 266c0-0.377-0.149-0.739-0.416-1.01-0.268-0.267-0.629-0.417-1.01-0.417-0.377 0-0.739 0.15-1.01 0.417s-0.417 0.629-0.417 1.01v25.8c0 0.231 0.188 0.419 0.418 0.419h2.01c0.231 0 0.418-0.188 0.418-0.419v-25.8z" />
          <path d="m142.6 266c0-0.377-0.15-0.739-0.417-1.01s-0.629-0.417-1.01-0.417c-0.377 0-0.739 0.15-1.01 0.417s-0.417 0.629-0.417 1.01v25.8c0 0.231 0.188 0.419 0.419 0.419h2.01c0.231 0 0.419-0.188 0.419-0.419v-25.8z" />
        </g>
        <g transform="translate(1 1)">
          <circle stroke="#979797" strokeWidth="3" fill="#1F1F1F" cx="133" cy="133" r="131" />
          <circle stroke="#fff" strokeWidth="2" fill="#D8D8D8" cx="133" cy="133" r="72" />
          <path
            d="M133.5,210 C146.478692,210 157,220.521308 157,233.5 C157,246.478692 146.478692,257 133.5,257 C120.521308,257 110,246.478692 110,233.5 C110,220.521308 120.521308,210 133.5,210 Z M83.5,197 C96.4786916,197 107,207.521308 107,220.5 C107,233.478692 96.4786916,244 83.5,244 C70.5213084,244 60,233.478692 60,220.5 C60,207.521308 70.5213084,197 83.5,197 Z M45.5,163 C58.4786916,163 69,173.521308 69,186.5 C69,199.478692 58.4786916,210 45.5,210 C32.5213084,210 22,199.478692 22,186.5 C22,173.521308 32.5213084,163 45.5,163 Z M32.5,114 C45.4786916,114 56,124.521308 56,137.5 C56,150.478692 45.4786916,161 32.5,161 C19.5213084,161 9,150.478692 9,137.5 C9,124.521308 19.5213084,114 32.5,114 Z M234.5,93 C247.478692,93 258,103.521308 258,116.5 C258,129.478692 247.478692,140 234.5,140 C221.521308,140 211,129.478692 211,116.5 C211,103.521308 221.521308,93 234.5,93 Z M41.5,64 C54.4786916,64 65,74.5213084 65,87.5 C65,100.478692 54.4786916,111 41.5,111 C28.5213084,111 18,100.478692 18,87.5 C18,74.5213084 28.5213084,64 41.5,64 Z M214.5,46 C227.478692,46 238,56.5213084 238,69.5 C238,82.4786916 227.478692,93 214.5,93 C201.521308,93 191,82.4786916 191,69.5 C191,56.5213084 201.521308,46 214.5,46 Z M76.5,26 C89.4786916,26 100,36.5213084 100,49.5 C100,62.4786916 89.4786916,73 76.5,73 C63.5213084,73 53,62.4786916 53,49.5 C53,36.5213084 63.5213084,26 76.5,26 Z M173.5,15 C186.478692,15 197,25.5213084 197,38.5 C197,51.4786916 186.478692,62 173.5,62 C160.521308,62 150,51.4786916 150,38.5 C150,25.5213084 160.521308,15 173.5,15 Z M123.5,7 C136.478692,7 147,17.5213084 147,30.5 C147,43.4786916 136.478692,54 123.5,54 C110.521308,54 100,43.4786916 100,30.5 C100,17.5213084 110.521308,7 123.5,7 Z"
            stroke="#fff"
            fillOpacity="0.5"
            fill="#D8D8D8"
            style={{
              transformOrigin: '133px 133px',
              transform: isAnimating ? `rotate(${angle}deg)` : 'rotate(0deg)',
              transition: 'transform 1000ms ease-in',
            }}
          />
        </g>
        <circle fillOpacity=".5" fill="#070707" cx="132.5" cy="132.5" r="132.5" />
        <g
          fontFamily="Marker Felt, monospace"
          fontSize="21"
          fill="#FFF"
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <text x="129" y="243" onMouseUp={() => dial(0)}>
            0
          </text>
          <text x="78" y="230" onMouseUp={() => dial(9)}>
            9
          </text>
          <text x="40" y="194" onMouseUp={() => dial(8)}>
            8
          </text>
          <text x="28" y="145" onMouseUp={() => dial(7)}>
            7
          </text>
          <text x="35" y="97" onMouseUp={() => dial(6)}>
            6
          </text>
          <text x="72" y="58" onMouseUp={() => dial(5)}>
            5
          </text>
          <text x="117" y="41" onMouseUp={() => dial(4)}>
            4
          </text>
          <text x="168" y="47" onMouseUp={() => dial(3)}>
            3
          </text>
          <text x="210" y="79" onMouseUp={() => dial(2)}>
            2
          </text>
          <text x="230" y="126" onMouseUp={() => dial(1)}>
            1
          </text>
        </g>
        <path
          d="M182.738529,211.096297 L177.320119,238.659185 L174.670528,252.137377 L188.487742,252.137377 L182.738529,211.096297 Z"
          stroke="#979797"
          fill="#D8D8D8"
          transform="translate(181.562666, 230.360231) rotate(-22.000000) translate(-181.562666, -230.360231)"
        />
      </svg>
    </div>
  );
};

export default memo(RotaryDialerNode);
