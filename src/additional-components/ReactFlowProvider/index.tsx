import React, { FC } from 'react';

import { Provider, createStore } from '../../store';

const ReactFlowProvider: FC = ({ children }) => <Provider createStore={createStore}>{children}</Provider>;

ReactFlowProvider.displayName = 'ReactFlowProvider';

export default ReactFlowProvider;
