import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';
import type { ReactFlowState } from '../../types';

const selector = (s: ReactFlowState) => ({
  userSelectionActive: s.userSelectionActive,
  userSelectionRect: s.userSelectionRect,
});

export function UserSelection() {
  const { userSelectionActive, userSelectionRect } = useStore(selector, shallow);
  const isActive = userSelectionActive && userSelectionRect;

  if (!isActive) {
    return null;
  }

  return (
    <div
      className="react-flow__selection react-flow__container"
      style={{
        width: userSelectionRect.width,
        height: userSelectionRect.height,
        transform: `translate(${userSelectionRect.x}px, ${userSelectionRect.y}px)`,
      }}
    />
  );
}
