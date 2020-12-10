import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom';

import Overview from './Overview';
import Basic from './Basic';
import CustomNode from './CustomNode';
import Stress from './Stress';
import Interaction from './Interaction';
import Empty from './Empty';
import Edges from './Edges';
import Validation from './Validation';
import Provider from './Provider';
import Hidden from './Hidden';
import EdgeTypes from './EdgeTypes';
import CustomConnectionLine from './CustomConnectionLine';
import NodeTypeChange from './NodeTypeChange';
import UpdatableEdge from './UpdatableEdge';
import UpdateLabel from './UpdateLabel';

import './index.css';

const routes = [
  {
    path: '/',
    component: Overview,
    label: 'Overview',
  },
  {
    path: '/edges',
    component: Edges,
    label: 'Edges',
  },
  {
    path: '/custom-node',
    component: CustomNode,
    label: 'CustomNode',
  },
  {
    path: '/validation',
    component: Validation,
    label: 'Validation',
  },
  {
    path: '/provider',
    component: Provider,
    label: 'Provider',
  },
  {
    path: '/stress',
    component: Stress,
    label: 'Stress',
  },
  {
    path: '/interaction',
    component: Interaction,
    label: 'Interaction',
  },
  {
    path: '/basic',
    component: Basic,
  },
  {
    path: '/empty',
    component: Empty,
  },
  {
    path: '/hidden',
    component: Hidden,
  },
  {
    path: '/edge-types',
    component: EdgeTypes,
  },
  {
    path: '/custom-connectionline',
    component: CustomConnectionLine,
  },
  {
    path: '/nodetype-change',
    component: NodeTypeChange,
  },
  {
    path: '/updatable-edge',
    component: UpdatableEdge,
    label: 'Updatable Edge',
  },
  {
    path: '/update-label',
    component: UpdateLabel,
    label: 'Update Label',
  },
];

const navLinks = routes.filter((route) => route.label);

const Header = () => {
  const [menuOpen, setMenuOpen] = useState();

  return (
    <header>
      <a className="logo" href="https://github.com/wbkd/react-flow">
        React Flow Dev
      </a>
      <nav className={menuOpen ? 'is-open' : ''}>
        {navLinks.map((route) => (
          <NavLink to={route.path} key={route.label} exact>
            {route.label}
          </NavLink>
        ))}
      </nav>
      <button className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        Menu
      </button>
    </header>
  );
};

ReactDOM.render(
  <Router forceRefresh={true}>
    <Header />
    <Switch>
      {routes.map((route) => (
        <Route exact path={route.path} render={() => <route.component />} key={route.path} />
      ))}
    </Switch>
  </Router>,
  document.getElementById('root')
);
