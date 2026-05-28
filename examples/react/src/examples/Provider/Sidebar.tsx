import { useNodes, useReactFlow, useStore, useViewport } from '@xyflow/react';

import styles from './provider.module.css';

const Sidebar = () => {
  const { setNodes } = useReactFlow();
  const nodes = useNodes();
  const nodeInfos = nodes.map((n) => `Node ${n.id} - x: ${n.position.x.toFixed(2)}, y: ${n.position.y.toFixed(2)}`);

  const transform = useViewport();

  const selectAll = () => {
    setNodes((nodes) => nodes.map((n) => ({ ...n, selected: true })));
  };

  return (
    <aside className={styles.aside}>
      <div className={styles.description}>
        This is an example of how you can access the internal state outside of the ReactFlow component.
      </div>
      <div className={styles.title}>Zoom & pan transform</div>
      <div className={styles.transform}>
        [{transform.x.toFixed(2)}, {transform.y.toFixed(2)}, {transform.zoom.toFixed(2)}]
      </div>
      <div className={styles.title}>Nodes</div>
      {nodeInfos.map((info, index) => (
        <div key={index}>{info}</div>
      ))}

      <div className={styles.selectall}>
        <button onClick={selectAll}>select all nodes</button>
      </div>
    </aside>
  );
};

export default Sidebar;
