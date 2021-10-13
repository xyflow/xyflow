import { useEffect } from 'react';

import { Elements, ReactFlowState } from '../../types';
import { useStore } from '../../store';

interface SelectionListenerProps {
  onSelectionChange: (elements: Elements | null) => void;
}

const selectedElementsSelector = (s: ReactFlowState) => s.selectedElements;

// This is just a helper component for calling the onSelectionChange listener.

export default ({ onSelectionChange }: SelectionListenerProps) => {
  const selectedElements = useStore(selectedElementsSelector);

  useEffect(() => {
    onSelectionChange(selectedElements);
  }, [selectedElements]);

  return null;
};
