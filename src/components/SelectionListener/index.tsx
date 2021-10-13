import { useEffect } from 'react';
import shallow from 'zustand/shallow';

import { Elements, ReactFlowState } from '../../types';
import { useStore } from '../../store';

interface SelectionListenerProps {
  onSelectionChange: (elements: Elements | null) => void;
}

const selectedElementsSelector = (s: ReactFlowState) => [
  ...s.nodes.filter((n) => n.selected),
  ...s.edges.filter((e) => e.selected),
];

// This is just a helper component for calling the onSelectionChange listener.

export default ({ onSelectionChange }: SelectionListenerProps) => {
  const selectedElements = useStore(selectedElementsSelector, shallow);

  useEffect(() => {
    onSelectionChange(selectedElements);
  }, [selectedElements]);

  return null;
};
