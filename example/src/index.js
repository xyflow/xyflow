import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom';

import Rich from './Rich';
import Basic from './Basic';
import CustomNode from './CustomNode';
import Stress from './Stress';
import Inactive from './Inactive';
import Empty from './Empty';

import './index.css';

const routes = [{
  path: '/',
  component: Rich,
  label: 'Rich'
}, {
  path: '/basic',
  component: Basic,
  label: 'Basic'
},{
  path: '/custom-node',
  component: CustomNode,
  label: 'CustomNode'
}, {
  path: '/stress',
  component: Stress,
  label: 'StressTest'
}, {
  path: '/empty',
  component: Empty
},{
  path: '/inactive',
  component: Inactive
}];

const navLinks = routes.filter(route => route.label);

ReactDOM.render((
  <Router forceRefresh={true}>
    <header>
      <div>React Flow Examples</div>
      <nav>
        {navLinks.map(route => (
          <NavLink to={route.path} key={route.label} exact>
            {route.label}
          </NavLink>
        ))}
      </nav>
    </header>
    <Switch>
      {routes.map(route => (
        <Route exact path={route.path} render={() => <route.component />} key={route.path} />
      ))}
    </Switch>
  </Router>
), document.getElementById('root'));

