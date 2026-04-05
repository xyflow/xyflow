import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';

export function UserSelection() {
  const { userSelectionActive, userSelectionRect } = useStore((s) => ({
    userSelectionActive: s.userSelectionActive,
    userSelectionRect: s.userSelectionRect,
  }), shallow);
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
