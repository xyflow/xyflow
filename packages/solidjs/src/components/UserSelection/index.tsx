// import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';
import type { SolidFlowState } from '../../types';
import { JSX, Show } from 'solid-js';

const selector = (s: SolidFlowState) => ({
  userSelectionActive: s.userSelectionActive,
  userSelectionRect: s.userSelectionRect,
});

export function UserSelection() {
  const { userSelectionActive, userSelectionRect } = useStore(selector);
  // const isActive = userSelectionActive && userSelectionRect;

  // if (!isActive) {
  //   return null;
  // }

  // const style = (): JSX.CSSProperties => {
  //   let s = {
  //     transform: `translate(${userSelectionRect.x}px, ${userSelectionRect.get().y}px)`,
  //   };
  //   const width = userSelectionRect.get()?.width;
  //   const height = userSelectionRect.get()?.height;
  //   if (typeof width === "number") {
  //     s = { ...s, width: width + "px" };
  //   }

  //   if (typeof height === "number") {
  //     s = { ...s, height: height + "px" };
  //   }

  //   return s
  // }

  return (
    <Show when={userSelectionActive.get() && userSelectionRect.get()}>
      {(rect) => {
        return (
          <div
            class="react-flow__selection react-flow__container"
            style={{
              width: rect().width + 'px',
              height: rect().height + 'px',
              transform: `translate(${rect().x}px, ${rect().y}px)`,
            }}
          />
        );
      }}
    </Show>
  );
}
