import { useKeyPress } from '@xyflow/react';
import { useEffect } from 'react';

const UseKeyPressComponent = () => {
  const metaPressed = useKeyPress(['Meta']);

  useEffect(() => {
    console.log({ metaPressed });
  }, [metaPressed]);

  return <div />;
};

export default UseKeyPressComponent;
