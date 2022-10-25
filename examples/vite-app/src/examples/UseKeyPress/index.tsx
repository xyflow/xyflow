import { useKeyPress } from 'reactflow';

const UseKeyPressComponent = () => {
  const metaPressed = useKeyPress(['Meta']);

  console.log({ metaPressed });

  return <div />;
};

export default UseKeyPressComponent;
