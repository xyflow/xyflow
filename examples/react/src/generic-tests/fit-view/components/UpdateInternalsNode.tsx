import { useEffect } from 'react';
import { NodeProps, useUpdateNodeInternals } from '@xyflow/react';

export default ({ id }: NodeProps) => {
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    updateNodeInternals(id);
  }, []);

  return <div style={{ width: '100px', height: '50px', background: 'red' }} />;
};
