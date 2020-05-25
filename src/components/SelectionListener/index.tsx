import { useEffect } from 'react';

import { Elements } from '../../types';
import { useStoreState } from '../../store/hooks';

interface SelectionListenerProps {
  onSelectionChange: (elements: Elements | null) => void;
}

// This is just a helper component for calling the onSelectionChange listener.
// As soon as easy-peasy has implemented the effectOn hook, we can remove this component
// and use the hook instead. https://github.com/ctrlplusb/easy-peasy/pull/459

export default ({ onSelectionChange }: SelectionListenerProps) => {
  const selectedElements = useStoreState((s) => s.selectedElements);

  useEffect(() => {
    onSelectionChange(selectedElements);
  }, [selectedElements]);

  return null;
};
