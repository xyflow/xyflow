import { SelectionRect } from '@xyflow/system';
import { useCustomDiff, useReactFlowStore, useSelectionStore } from '../../hooks/useReactFlowStore';
import type { SelectionStore } from '../../types';

const selector = (s: SelectionStore) => s.userSelectionRect;

export function UserSelection() {
  const { userSelectionActive } = useReactFlowStore();
  const userSelectionRect = useSelectionStore(useCustomDiff(selector, areEqual));
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
function areEqual(a: SelectionRect | null, b: SelectionRect | null): boolean {
  return a?.x === b?.x && a?.y === b?.y && a?.width === b?.width && a?.height === b?.height;
}
