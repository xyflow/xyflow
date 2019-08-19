import React, { createContext, useState, memo, useMemo } from 'react';

export const ConnectionContext = createContext({});

export const Provider = memo(({ onConnect, children }) => {
  const [sourceId, setSourceId] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const connectionContext = useMemo(() => ({
    sourceId,
    setSourceId,
    position,
    setPosition,
    onConnect
  }), [sourceId, position.x, position.y]);

  return (
    <ConnectionContext.Provider value={connectionContext}>
      {children}
    </ConnectionContext.Provider>
  );
});

Provider.displayName = 'ConnectionProvider';
Provider.whyDidYouRender = false;

export const { Consumer } = ConnectionContext;
