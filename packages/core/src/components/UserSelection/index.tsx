import { shallow } from 'zustand/shallow';
import type { ReactFlowState } from '@reactflow/system';

import { useStore } from '../../hooks/useStore';

const selector = (s: ReactFlowState) => ({
  userSelectionActive: s.userSelectionActive,
  userSelectionRect: s.userSelectionRect,
});

function UserSelection() {
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

export default UserSelection;
