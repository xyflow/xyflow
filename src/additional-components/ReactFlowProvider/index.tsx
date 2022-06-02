import React, { FC, PropsWithChildren } from 'react';

import { Provider, createStore } from '../../store';

const ReactFlowProvider: FC<PropsWithChildren<{}>> = ({ children }) => (
  <Provider createStore={createStore}>{children}</Provider>
);

ReactFlowProvider.displayName = 'ReactFlowProvider';

export default ReactFlowProvider;
