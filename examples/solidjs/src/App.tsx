import type { Component } from 'solid-js';

import styles from './App.module.css';
import BasicFlow from './SimpleExample';
import { BasicExample } from './BasicExample';
import DeleteMeExample from './DeleteMiddleNode';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <DeleteMeExample />
      {/* <BasicExample /> */}
      {/* <BasicFlow /> */}
    </div>
  );
};

export default App;
