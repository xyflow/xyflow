import { SelectionRect } from '@xyflow/system';
import { useCustomDiff, useReactFlowStore } from '../../hooks/useReactFlowStore';
import type { ReactFlowState } from '../../types';

const selector = (s: ReactFlowState) => ({
  userSelectionActive: s.userSelectionActive,
  userSelectionRect: s.userSelectionRect,
});

export function UserSelection() {
  const { userSelectionActive, userSelectionRect } = useReactFlowStore(useCustomDiff(selector, areEqual));
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
function areEqual(
  a: { userSelectionActive: boolean; userSelectionRect: SelectionRect | null },
  b: { userSelectionActive: boolean; userSelectionRect: SelectionRect | null }
): boolean {
  return (
    a.userSelectionActive === b.userSelectionActive &&
    a.userSelectionRect?.x === b.userSelectionRect?.x &&
    a.userSelectionRect?.y === b.userSelectionRect?.y &&
    a.userSelectionRect?.width === b.userSelectionRect?.width &&
    a.userSelectionRect?.height === b.userSelectionRect?.height
  );
}
