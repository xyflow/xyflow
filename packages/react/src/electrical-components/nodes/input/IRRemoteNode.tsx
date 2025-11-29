import { memo, useState } from 'react';
import { NodeProps, BuiltInNode } from '@xyflow/react';

const irKeyCodes: { [key: string]: number } = {
  power: 0xa2,
  menu: 0xe2,
  test: 0x22,
  plus: 0x02,
  back: 0xc2,
  prev: 0xe0,
  play: 0xa8,
  next: 0x90,
  0: 0x68,
  minus: 0x98,
  c: 0xb0,
  1: 0x30,
  2: 0x18,
  3: 0x7a,
  4: 0x10,
  5: 0x38,
  6: 0x5a,
  7: 0x42,
  8: 0x4a,
  9: 0x52,
};

const IRRemoteNode = ({ data }: NodeProps<BuiltInNode>) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonDown = (buttonId: string) => {
    setActiveButton(buttonId);
  };

  const handleButtonUp = () => {
    setActiveButton(null);
  };

  const getButtonFill = (buttonId: string, defaultColor: string) => {
    if (activeButton === buttonId) {
      return defaultColor === '#e6252e' || defaultColor === '#121115' ? 'green' : '#8c8';
    }
    return defaultColor;
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg
        version="1.1"
        viewBox="0 0 151 316"
        width="40mm"
        height="83.653mm"
        fontFamily="sans-serif"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{ userSelect: 'none' }}
      >
        <defs>
          <g id="button" strokeWidth="1.29">
            <path
              fill="#272726"
              d="m0 -17.5c-9.73 0-17.6 7.9-17.6 17.6 0 9.73 7.9 17.6 17.6 17.6 9.73 0 17.6-7.9 17.6-17.6 0-9.73-7.9-17.6-17.6-17.6zm0 1.29c9.01 0 16.3 7.32 16.3 16.3 0 9.01-7.32 16.3-16.3 16.3-9.02 0-16.3-7.32-16.3-16.3 0-9.02 7.32-16.3 16.3-16.3z"
            />
            <circle r="16.3" />
          </g>
          <circle id="button2" r="16.3" />
        </defs>
        <path
          d="m149 21.3c0-10.5-8.52-19-19-19h-109c-10.5 0-19 8.52-19 19v274c0 10.5 8.52 19 19 19h109c10.5 0 19-8.52 19-19z"
          fill="#fff"
          stroke="#272726"
          strokeWidth="4.53px"
        />
        <use
          xlinkHref="#button2"
          x="29.6"
          y="37.9"
          fill={getButtonFill('power', '#e6252e')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('power')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <use
          xlinkHref="#button"
          x="121.4"
          y="37.9"
          fill={getButtonFill('menu', '#fff')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('menu')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <use
          xlinkHref="#button"
          x="29.6"
          y="75.2"
          fill={getButtonFill('test', '#fff')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('test')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <use
          xlinkHref="#button2"
          x="75.5"
          y="75.2"
          fill={getButtonFill('plus', '#121115')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('plus')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <use
          xlinkHref="#button"
          x="121.4"
          y="75.2"
          fill={getButtonFill('back', '#fff')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('back')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <use
          xlinkHref="#button2"
          x="29.6"
          y="113"
          fill={getButtonFill('prev', '#121115')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('prev')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <use
          xlinkHref="#button"
          x="75.5"
          y="113"
          fill={getButtonFill('play', '#fff')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('play')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <use
          xlinkHref="#button2"
          x="121.4"
          y="113"
          fill={getButtonFill('next', '#121115')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('next')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <use
          xlinkHref="#button"
          x="29.6"
          y="152"
          fill={getButtonFill('0', '#fff')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('0')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <use
          xlinkHref="#button2"
          x="75.5"
          y="152"
          fill={getButtonFill('minus', '#121115')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('minus')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <use
          xlinkHref="#button"
          x="121.4"
          y="152"
          fill={getButtonFill('c', '#fff')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('c')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <use
          xlinkHref="#button"
          x="29.6"
          y="190"
          fill={getButtonFill('1', '#fff')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('1')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <use
          xlinkHref="#button"
          x="75.5"
          y="190"
          fill={getButtonFill('2', '#fff')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('2')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <use
          xlinkHref="#button"
          x="121.4"
          y="190"
          fill={getButtonFill('3', '#fff')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('3')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <use
          xlinkHref="#button"
          x="29.6"
          y="228"
          fill={getButtonFill('4', '#fff')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('4')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <use
          xlinkHref="#button"
          x="75.5"
          y="228"
          fill={getButtonFill('5', '#fff')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('5')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <use
          xlinkHref="#button"
          x="121.4"
          y="228"
          fill={getButtonFill('6', '#fff')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('6')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <use
          xlinkHref="#button"
          x="29.6"
          y="266"
          fill={getButtonFill('7', '#fff')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('7')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <use
          xlinkHref="#button"
          x="75.5"
          y="266"
          fill={getButtonFill('8', '#fff')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('8')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <use
          xlinkHref="#button"
          x="121.4"
          y="266"
          fill={getButtonFill('9', '#fff')}
          style={{ cursor: 'pointer' }}
          onMouseDown={() => handleButtonDown('9')}
          onMouseUp={handleButtonUp}
          onMouseLeave={handleButtonUp}
        />
        <g style={{ pointerEvents: 'none' }}>
          <g fill="none" stroke="#fff" strokeWidth="1.94px">
            <path d="m33.5 33c2.05 1.28 3.42 3.56 3.42 6.16 0 4.01-3.26 7.26-7.26 7.26-4.01 0-7.26-3.25-7.26-7.26 0-2.49 1.26-4.69 3.17-6" />
            <path d="m29.6 29.3v7.41" />
          </g>
          <path d="m80.9 113-9.58 4.79v-9.58z" fill="#121115" strokeWidth="1.29" />
          <path d="m123.4 113-9.58 4.79v-9.58z" fill="#fff" strokeWidth="1.29" />
          <path d="m129.4 113-8.95 4.79v-9.58z" fill="#fff" strokeWidth="1.29" />
          <path d="m129.4 109v9.58" fill="none" stroke="#fff" strokeWidth="1.29" />
          <path d="m27.9 113 9.58 4.79v-9.58z" fill="#fff" strokeWidth="1.29" />
          <path d="m21.8 113 8.95 4.79v-9.58z" fill="#fff" strokeWidth="1.29" />
          <path d="m22.4 109v9.58" fill="none" stroke="#fff" strokeWidth="1.29" />
          <text fill="#e6252e" fontSize="9.72px" fontWeight="700" strokeWidth="1.29">
            <tspan x="106.892 115.469 122.432 129.931" y="41.288">MENU</tspan>
            <tspan x="16.488 22.904 29.866 36.829" y="78.679">TEST</tspan>
          </text>
          <g fill="none" stroke="#fff" strokeWidth="1.29">
            <path d="m67.7 152h15.5" />
            <path d="m67.7 75.2h15.5M75.5 67.4v15.5" />
          </g>
          <g fill="#121115" strokeWidth="1.29">
            <path d="m119.4 70.7v -3.25l-6.95 4.84 6.71 4.45 0.111-2.2s6.65-0.357 7.05 3.15c0.397 3.51-6.66 5.21-6.66 5.21s10.9-2.33 10.7-6.82c-0.276-5.4-10.9-5.39-10.9-5.39z" />
            <text fontSize="13.9px" fontWeight="700">
              <tspan x="25.312" y="156.434">0</tspan>
              <tspan x="116.973" y="156.498">C</tspan>
              <tspan x="25.312" y="194.685">1</tspan>
              <tspan x="71.776" y="194.685">2</tspan>
              <tspan x="118.06" y="194.6">3</tspan>
              <tspan x="25.312" y="232.851">4</tspan>
              <tspan x="71.776" y="232.679">5</tspan>
              <tspan x="118.199" y="232.767">6</tspan>
              <tspan x="25.312" y="270.931">7</tspan>
              <tspan x="71.776" y="270.931">8</tspan>
              <tspan x="118.124" y="270.931">9</tspan>
            </text>
          </g>
          <g fill="#fff" strokeWidth="1.29">
            <path d="m18 28.5c0.687-0.757 1.5-1.41 2.39-1.99 1.26-0.814 2.7-1.43 4.22-1.87 0.974-0.281 1.98-0.481 3-0.607 0.673-0.0828 1.35-0.129 2.03-0.147 0.68-0.0181 1.36-0.0078 2.03 0.0427 1.02 0.0789 2.03 0.243 3 0.511 2.48 0.686 4.72 2.02 6.31 4.19 0.0323 0.0479 0.097 0.0608 0.145 0.0298 0.0479-0.0323 0.0621-0.097 0.0298-0.145-0.846-1.45-1.96-2.62-3.27-3.53-0.894-0.623-1.87-1.12-2.91-1.5-1.19-0.433-2.45-0.709-3.73-0.828-0.543-0.0504-1.09-0.0698-1.64-0.0582-0.728 0.0155-1.46 0.0841-2.18 0.202-1.08 0.177-2.14 0.46-3.16 0.839-0.772 0.288-1.51 0.632-2.21 1.03-1.7 0.965-3.16 2.22-4.22 3.7-0.0362 0.0453-0.0298 0.111 0.0155 0.146 0.0453 0.0362 0.11 0.0298 0.146-0.0155z" />
            <path d="m64 65.5c0.687-0.757 1.5-1.41 2.39-1.99 1.26-0.814 2.7-1.43 4.22-1.87 0.974-0.281 1.98-0.481 3-0.607 0.673-0.0815 1.35-0.129 2.03-0.147 0.679-0.0181 1.36-0.0078 2.03 0.044 1.02 0.0776 2.03 0.242 3 0.51 2.48 0.686 4.72 2.02 6.31 4.19 0.031 0.0479 0.0957 0.0621 0.145 0.0298 0.0479-0.031 0.0608-0.0957 0.0297-0.145-0.847-1.45-1.97-2.62-3.27-3.53-0.892-0.623-1.87-1.12-2.91-1.5-1.19-0.433-2.45-0.709-3.73-0.828-0.545-0.0504-1.09-0.0698-1.64-0.0582-0.728 0.0155-1.46 0.0841-2.18 0.202-1.08 0.177-2.14 0.46-3.16 0.839-0.772 0.288-1.51 0.632-2.22 1.03-1.7 0.965-3.16 2.22-4.22 3.7-0.0362 0.0453-0.0285 0.111 0.0155 0.147 0.0453 0.0362 0.111 0.0285 0.147-0.0168z" />
            <path d="m18 104c0.687-0.757 1.5-1.42 2.39-1.99 1.26-0.814 2.7-1.43 4.22-1.87 0.974-0.281 1.98-0.481 3-0.607 0.673-0.0815 1.35-0.129 2.03-0.147 0.68-0.0181 1.36-8e-3 2.03 0.044 1.02 0.0776 2.03 0.242 3 0.51 2.48 0.686 4.72 2.02 6.31 4.19 0.0323 0.0478 0.097 0.0621 0.145 0.0297 0.0479-0.031 0.0621-0.0957 0.0298-0.145-0.846-1.45-1.96-2.62-3.27-3.53-0.894-0.623-1.87-1.12-2.91-1.5-1.19-0.433-2.45-0.709-3.73-0.828-0.543-0.0504-1.09-0.0698-1.64-0.0582-0.728 0.0155-1.46 0.0841-2.18 0.202-1.08 0.177-2.14 0.46-3.16 0.839-0.772 0.288-1.51 0.632-2.21 1.03-1.7 0.965-3.16 2.22-4.22 3.7-0.0362 0.0453-0.0298 0.111 0.0155 0.147 0.0453 0.0362 0.11 0.0285 0.146-0.0168z" />
            <path d="m110.4 104c0.687-0.757 1.5-1.42 2.39-1.99 1.26-0.814 2.7-1.43 4.22-1.87 0.974-0.281 1.98-0.481 3-0.607 0.673-0.0815 1.35-0.129 2.03-0.147 0.68-0.0181 1.36-8e-3 2.03 0.044 1.02 0.0776 2.03 0.242 3 0.51 2.48 0.686 4.72 2.02 6.31 4.19 0.031 0.0478 0.0957 0.0621 0.145 0.0297 0.0479-0.031 0.0608-0.0957 0.0298-0.145-0.847-1.45-1.97-2.62-3.27-3.53-0.892-0.623-1.87-1.12-2.91-1.5-1.19-0.433-2.45-0.709-3.73-0.828-0.545-0.0504-1.09-0.0698-1.64-0.0582-0.728 0.0155-1.46 0.0841-2.18 0.202-1.08 0.177-2.14 0.46-3.16 0.839-0.772 0.288-1.51 0.632-2.22 1.03-1.7 0.965-3.16 2.22-4.22 3.7-0.0362 0.0453-0.0285 0.111 0.0155 0.147 0.0453 0.0362 0.111 0.0285 0.147-0.0168z" />
            <path d="m64 142c0.687-0.758 1.5-1.42 2.39-1.99 1.26-0.815 2.7-1.43 4.22-1.87 0.974-0.279 1.98-0.481 3-0.605 0.673-0.0828 1.35-0.129 2.03-0.147 0.679-0.0181 1.36-9e-3 2.03 0.0427 1.02 0.0789 2.03 0.243 3 0.511 2.48 0.686 4.72 2.02 6.31 4.19 0.031 0.0491 0.0957 0.0621 0.145 0.031 0.0479-0.0323 0.0608-0.097 0.0297-0.145-0.847-1.45-1.97-2.62-3.27-3.54-0.892-0.623-1.87-1.12-2.91-1.5-1.19-0.435-2.45-0.71-3.73-0.829-0.545-0.0504-1.09-0.0698-1.64-0.0569-0.728 0.0155-1.46 0.0841-2.18 0.202-1.08 0.177-2.14 0.459-3.16 0.838-0.772 0.29-1.51 0.632-2.22 1.03-1.7 0.965-3.16 2.22-4.22 3.7-0.0362 0.044-0.0285 0.11 0.0155 0.146 0.0453 0.0362 0.111 0.0284 0.147-0.0155z" />
          </g>
        </g>
      </svg>
    </div>
  );
};

IRRemoteNode.displayName = 'IRRemoteNode';

export default memo(IRRemoteNode);
