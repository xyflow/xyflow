import { memo } from 'react';
import { Handle, Position, NodeProps, BuiltInNode } from '@xyflow/react';

const bandColors: { [key: number]: string } = {
  [-2]: '#C3C7C0', // Silver
  [-1]: '#F1D863', // Gold
  0: '#000000', // Black
  1: '#8F4814', // Brown
  2: '#FB0000', // Red
  3: '#FC9700', // Orange
  4: '#FCF800', // Yellow
  5: '#00B800', // Green
  6: '#0000FF', // Blue
  7: '#A803D6', // Violet
  8: '#808080', // Gray
  9: '#FCFCFC', // White
};

const ResistorNode = memo(({ data }: NodeProps<BuiltInNode>) => {
  const value = (data.value as string) || '1000';

  const pinInfo = [
    { name: '1', x: 0, y: 8.95 },
    { name: '2', x: 58.8, y: 8.95 },
  ];

  const breakValue = (val: number): [number, number] => {
    const exponent =
      val >= 1e10
        ? 9
        : val >= 1e9
          ? 8
          : val >= 1e8
            ? 7
            : val >= 1e7
              ? 6
              : val >= 1e6
                ? 5
                : val >= 1e5
                  ? 4
                  : val >= 1e4
                    ? 3
                    : val >= 1e3
                      ? 2
                      : val >= 1e2
                        ? 1
                        : val >= 1e1
                          ? 0
                          : val >= 1
                            ? -1
                            : -2;
    const base = Math.round(val / 10 ** exponent);
    if (val === 0) {
      return [0, 0];
    }
    return [Math.round(base % 100), exponent];
  };

  const numValue = parseFloat(value);
  const [base, exponent] = breakValue(numValue);
  const band1Color = bandColors[Math.floor(base / 10)];
  const band2Color = bandColors[base % 10];
  const band3Color = bandColors[exponent];

  return (
    <div
      style={{
        background: 'transparent',
        position: 'relative',
        width: '59.1px', // 15.645mm converted to px
      }}
    >
      <svg
        width="15.645mm"
        height="3mm"
        viewBox="0 0 15.645 3"
      >
        <defs>
          <linearGradient
            id="a"
            x2="0"
            y1="22.332"
            y2="38.348"
            gradientTransform="matrix(.14479 0 0 .14479 -23.155 -4.0573)"
            gradientUnits="userSpaceOnUse"
            spreadMethod="reflect"
          >
            <stop stopColor="#323232" offset="0" />
            <stop stopColor="#fff" stopOpacity="0.42268" offset="1" />
          </linearGradient>
          <clipPath id="g">
            <path
              id="body"
              d="m4.6918 0c-1.0586 0-1.9185 0.67468-1.9185 1.5022 0 0.82756 0.85995 1.4978 1.9185 1.4978 0.4241 0 0.81356-0.11167 1.1312-0.29411h4.0949c0.31802 0.18313 0.71075 0.29411 1.1357 0.29411 1.0586 0 1.9185-0.67015 1.9185-1.4978 0-0.8276-0.85995-1.5022-1.9185-1.5022-0.42499 0-0.81773 0.11098-1.1357 0.29411h-4.0949c-0.31765-0.18244-0.7071-0.29411-1.1312-0.29411z"
            />
          </clipPath>
        </defs>
        <rect y="1.1759" width="15.558" height="0.63826" fill="#aaa" />
        <g strokeWidth="0.14479" fill="#d5b597">
          <path
            d="m4.6918 0c-1.0586 0-1.9185 0.67468-1.9185 1.5022 0 0.82756 0.85995 1.4978 1.9185 1.4978 0.4241 0 0.81356-0.11167 1.1312-0.29411h4.0949c0.31802 0.18313 0.71075 0.29411 1.1357 0.29411 1.0586 0 1.9185-0.67015 1.9185-1.4978 0-0.8276-0.85995-1.5022-1.9185-1.5022-0.42499 0-0.81773 0.11098-1.1357 0.29411h-4.0949c-0.31765-0.18244-0.7071-0.29411-1.1312-0.29411z"
          />
          <path
            d="m4.6918 0c-1.0586 0-1.9185 0.67468-1.9185 1.5022 0 0.82756 0.85995 1.4978 1.9185 1.4978 0.4241 0 0.81356-0.11167 1.1312-0.29411h4.0949c0.31802 0.18313 0.71075 0.29411 1.1357 0.29411 1.0586 0 1.9185-0.67015 1.9185-1.4978 0-0.8276-0.85995-1.5022-1.9185-1.5022-0.42499 0-0.81773 0.11098-1.1357 0.29411h-4.0949c-0.31765-0.18244-0.7071-0.29411-1.1312-0.29411z"
            fill="url(#a)"
            opacity="0.44886"
          />
          <rect x="4" y="0" width="1" height="3" fill={band1Color} clipPath="url(#g)" />

          <path d="m6 0.29411v2.4117h0.96v-2.4117z" fill={band2Color} />
          <path d="m7.8 0.29411v2.4117h0.96v-2.4117z" fill={band3Color} />

          <rect x="10.69" y="0" width="1" height="3" fill="#F1D863" clipPath="url(#g)" />
        </g>
      </svg>

      {/* Handles for pins */}
      {pinInfo.map((pin, index) => (
        <Handle
          key={`${pin.name}-source-${index}`}
          type="source"
          position={index === 0 ? Position.Left : Position.Right}
          id={`${pin.name}-source`}
          style={{
            left: index === 0 ? `${pin.x}px` : `${pin.x - 7}px`,
            top: `${pin.y}px`,
            width: '4px',
            height: '4px',
            background: '#1a192b',
            border: '1px solid #fff',
          }}
        />
      ))}
      {pinInfo.map((pin, index) => (
        <Handle
          key={`${pin.name}-target-${index}`}
          type="target"
          position={index === 0 ? Position.Left : Position.Right}
          id={`${pin.name}-target`}
          style={{
            left: index === 0 ? `${pin.x}px` : `${pin.x - 7}px`,
            top: `${pin.y}px`,
            width: '4px',
            height: '4px',
            background: '#1a192b',
            border: '1px solid #fff',
          }}
        />
      ))}
    </div>
  );
});

ResistorNode.displayName = 'ResistorNode';

export default ResistorNode;
