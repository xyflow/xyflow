import { useConnection } from '@xyflow/react';

import styles from './validation.module.css';

function ConnectionStatus() {
  const connection = useConnection();

  if (!connection.inProgress) {
    return null;
  }

  return (
    <div className={styles.connectionstatus}>
      {connection.inProgress ? (
        <>
          <div>
            <strong>connection info</strong>
          </div>
          <div>position: {JSON.stringify(connection.to)}</div>
          <div>status: {connection.isValid}</div>
          <div>from node id: {connection.fromNode?.id}</div>
          <div>from handle type: {connection.fromHandle?.type}</div>
          <div>to node id: {connection.toNode?.id}</div>
          <div>to handle type: {connection.toHandle?.type}</div>
        </>
      ) : (
        'no connection data'
      )}
    </div>
  );
}

export default ConnectionStatus;
