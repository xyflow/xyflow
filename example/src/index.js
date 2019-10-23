import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import CustomNode from './CustomNode';
import Rich from './Rich';
import Basic from './Basic';
import Empty from './Empty';
import Inactive from './Inactive';

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
      <Route path="/inactive">
        <Inactive />
      </Route>
      <Route path="/custom-node">
        <CustomNode />
      </Route>
      <Route path="/">
        <Rich />
      </Route>
    </Switch>
  </Router>
), document.getElementById('root'));
