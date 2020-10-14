import { useState, useEffect } from 'react';

const getInnerHeight = () => {
  return typeof window !== 'undefined' ? window.innerHeight : 0;
};

export default function useMenuHeight() {
  const [menuHeight, setMenuHeight] = useState(getInnerHeight());

  useEffect(() => {
    const onResize = () => {
      setMenuHeight(getInnerHeight());
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return menuHeight;
}
