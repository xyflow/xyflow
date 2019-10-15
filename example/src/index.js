import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Advanced from './Advanced';
import Basic from './Basic';
import Empty from './Empty';

import './index.css';

ReactDOM.render((
  <Router>
    <Switch>
      <Route path="/basic">
        <Basic />
      </Route>
      <Route path="/empty">
        <Empty />
      </Route>
      <Route path="/">
        <Advanced />
      </Route>
    </Switch>
  </Router>
), document.getElementById('root'));
