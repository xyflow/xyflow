import { ReactFlowState, useStore } from 'reactflow';
import { shallow } from 'zustand/shallow';

import styles from './validation.module.css';

const selector = (state: ReactFlowState) => ({
  connectionPosition: state.connectionPosition,
  connectionStatus: state.connectionStatus,
  connectionNodeId: state.connectionNodeId,
  connectionTargetNodeId: state.connectionTargetNodeId,
});

function ConnectionStatus() {
  const { connectionPosition, connectionStatus, connectionNodeId, connectionTargetNodeId } = useStore(
    selector,
    shallow
  );

  if (!connectionPosition) {
    return null;
  }

  return (
    <div className={styles.connectionstatus}>
      {connectionNodeId ? (
        <>
          <div>
            <strong>connection info</strong>
          </div>
          <div>position: {JSON.stringify(connectionPosition)}</div>
          <div>status: {JSON.stringify(connectionStatus)}</div>
          <div>source node id: {JSON.stringify(connectionNodeId)}</div>
          <div>target node id: {JSON.stringify(connectionTargetNodeId)}</div>
        </>
      ) : (
        'no connection data'
      )}
    </div>
  );
}

export default ConnectionStatus;
