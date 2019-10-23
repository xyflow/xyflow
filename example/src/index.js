import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import CustomNodes from './CustomNodes';
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
      <Route path="/">
        <CustomNodes />
      </Route>
    </Switch>
  </Router>
), document.getElementById('root'));
