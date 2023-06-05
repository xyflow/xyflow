import { ReactFlowState, useStore } from '@xyflow/react';
import { shallow } from 'zustand/shallow';

import styles from './validation.module.css';

const selector = (state: ReactFlowState) => ({
  connectionPosition: state.connectionPosition,
  connectionStatus: state.connectionStatus,
  connectionStartNodeId: state.connectionStartHandle?.nodeId,
  connectionStartHandleType: state.connectionStartHandle?.type,
  connectionEndNodeId: state.connectionEndHandle?.nodeId,
  connectionEndHandleType: state.connectionEndHandle?.type,
});

function ConnectionStatus() {
  const {
    connectionPosition,
    connectionStatus,
    connectionStartNodeId,
    connectionStartHandleType,
    connectionEndNodeId,
    connectionEndHandleType,
  } = useStore(selector, shallow);

  if (!connectionPosition) {
    return null;
  }

  return (
    <div className={styles.connectionstatus}>
      {connectionStartNodeId ? (
        <>
          <div>
            <strong>connection info</strong>
          </div>
          <div>position: {JSON.stringify(connectionPosition)}</div>
          <div>status: {connectionStatus}</div>
          <div>from node id: {connectionStartNodeId}</div>
          <div>from handle type: {connectionStartHandleType}</div>
          <div>to node id: {connectionEndNodeId}</div>
          <div>to handle type: {connectionEndHandleType}</div>
        </>
      ) : (
        'no connection data'
      )}
    </div>
  );
}

export default ConnectionStatus;
