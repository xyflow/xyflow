import { useEffect } from 'react';

import { useStoreActions } from '../../store/hooks';
import { Elements } from '../../types';

interface ElementUpdaterProps {
  elements: Elements;
}

const ElementUpdater = ({ elements }: ElementUpdaterProps) => {
  const setElements = useStoreActions((actions) => actions.setElements);

  useEffect(() => {
    setElements(elements);
  }, [elements]);

  return null;
};

export default ElementUpdater;
