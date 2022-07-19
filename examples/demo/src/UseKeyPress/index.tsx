import { useKeyPress } from '@react-flow/core';

const UseKeyPressComponent = () => {
  const metaPressed = useKeyPress(['Meta']);

  console.log({ metaPressed });

  return <div />;
};

export default UseKeyPressComponent;
