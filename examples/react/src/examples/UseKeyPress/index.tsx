import { useKeyPress } from '@xyflow/react';
import { useEffect, useState } from 'react';

const UseKeyPressComponent = () => {
  const metaPressed = useKeyPress(['Meta']);

  useEffect(() => {
    console.log({ metaPressed });
  }, [metaPressed]);

  return (
    <div>
      <KeyState name="control" combination="Control+z" />
      <KeyState name="meta" combination="Meta+z" />
      <KeyState name="code" combination="Control+KeyZ" />
      <KeyState name="plain" combination="a+s" />
      <KeyState name="input" combination="Control+z" insideInput={false} />
      <input aria-label="Keyboard shortcut test input" />
    </div>
  );
};

export default UseKeyPressComponent;

function KeyState({
  name,
  combination,
  insideInput = true,
}: {
  name: string;
  combination: string;
  insideInput?: boolean;
}) {
  const pressed = useKeyPress(combination, { actInsideInputWithModifier: insideInput });
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (pressed) {
      setCount((value) => value + 1);
    }
  }, [pressed]);
  return (
    <output data-testid={name} data-pressed={pressed} data-ready={ready}>
      {count}
    </output>
  );
}
