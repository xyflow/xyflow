// import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';
import type { SolidFlowState } from '../../types';
import { JSX, Show } from 'solid-js';

const selector = (s: SolidFlowState) => ({
  userSelectionActive: () => s.userSelectionActive.get(),
  userSelectionRect: () => s.userSelectionRect.get(),
});

export function UserSelection() {
  const storeData = useStore(selector);

  return (
    <Show when={storeData.userSelectionActive() && storeData.userSelectionRect()}>
      <div
        class="react-flow__selection react-flow__container"
        style={{
          transform: `translate(${storeData.userSelectionRect()!.x}px, ${storeData.userSelectionRect()!.y}px)`,
          width: `${storeData.userSelectionRect()!.width}px`,
          height: `${storeData.userSelectionRect()!.height}px`,
        }}
      />
    </Show>
  );
}
