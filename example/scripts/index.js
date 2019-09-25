import React from 'react';
import { render } from 'react-dom';
import { unstable_trace as trace } from 'scheduler/tracing';

import ExampleGraph from './ExampleGraph';

trace('initial render', performance.now(), () =>
  render(<ExampleGraph />, document.getElementById('root'))
);
