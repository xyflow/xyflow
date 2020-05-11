import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, NavLink, withRouter } from 'react-router-dom';

import Rich from './Rich';
import Basic from './Basic';
import CustomNode from './CustomNode';
import Stress from './Stress';
import Inactive from './Inactive';
import Empty from './Empty';
import Edges from './Edges';

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
  label: 'Stress'
}, {
  path: '/edges',
  component: Edges,
  label: 'Edges'
}, {
  path: '/empty',
  component: Empty
}, {
  path: '/inactive',
  component: Inactive
}];

const navLinks = routes.filter(route => route.label);

const SourceDisplay = withRouter(({ location }) => {
  const route = routes.find(route => route.path === location.pathname);
  const sourceLink = `https://github.com/wbkd/react-flow/tree/master/example/src/${route.label}/index.js`;

  return (
    <a className="sourcedisplay" href={sourceLink}>
     {'<Source />'}
    </a>
  );
});

ReactDOM.render((
  <Router forceRefresh={true}>
    <header>
      <a href="https://github.com/wbkd/react-flow">React Flow</a>
      <nav>
        {navLinks.map(route => (
          <NavLink to={route.path} key={route.label} exact>
            {route.label}
          </NavLink>
        ))}
      </nav>
    </header>
    <SourceDisplay />
    <Switch>
      {routes.map(route => (
        <Route exact path={route.path} render={() => <route.component />} key={route.path} />
      ))}
    </Switch>
  </Router>
), document.getElementById('root'));

