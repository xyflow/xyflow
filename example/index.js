import React from 'react';
import { render } from 'react-dom';
import { unstable_trace as trace } from "scheduler/tracing";

import SimpleGraph from './SimpleGraph';

trace('initial render', performance.now(), () =>
  render(<SimpleGraph />, document.getElementById('root'))
);
