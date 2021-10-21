import { useEffect } from 'react';

import { Elements } from '../../types';
import { useStoreState } from '../../store/hooks';

interface SelectionListenerProps {
  onSelectionChange: (elements: Elements | null) => void;
}

// This is a helper component for calling the onSelectionChange listener

export default ({ onSelectionChange }: SelectionListenerProps) => {
  const selectedElements = useStoreState((s) => s.selectedElements);

  useEffect(() => {
    onSelectionChange(selectedElements);
  }, [selectedElements]);

  return null;
};
