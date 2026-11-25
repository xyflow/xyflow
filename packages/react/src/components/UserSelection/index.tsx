import { useOptionsStore, useSelectionStore, useShallow } from '../../hooks/useReactFlowStore';

export function UserSelection() {
  const userSelectionActive = useOptionsStore((s) => s.userSelectionActive);
  const userSelectionRect = useSelectionStore(useShallow((s) => s.userSelectionRect));
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
