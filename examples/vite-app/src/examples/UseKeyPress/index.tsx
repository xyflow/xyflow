import { useKeyPress } from '@xyflow/react';

const UseKeyPressComponent = () => {
  const metaPressed = useKeyPress(['Meta']);

  console.log({ metaPressed });

  return <div />;
};

export default UseKeyPressComponent;
