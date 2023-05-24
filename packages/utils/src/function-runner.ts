/** Helper that can be used like a useEffect
 *
 *  const caller = FunctionRunner();
 *
 *  // the callback will be called when one of the dependencies ([a, b, c]) change
 *  caller.onChange(() => {}, [a, b, c]);
 */

export default function FunctionRunner() {
  const depCache: Record<number, Array<unknown>> = {};
  let index = 0;

  function restart() {
    index = 0;
  }

  function onChange(callback: () => void, deps: Array<unknown>) {
    const oldDeps = depCache[index];
    let depsChanged = true;

    if (oldDeps) {
      depsChanged = deps.some((d: unknown, i: number) => !Object.is(d, oldDeps[i]));
    }

    if (depsChanged) {
      callback();
    }

    depCache[index] = deps;
    index++;
  }

  return {
    onChange,
    restart,
  };
}
