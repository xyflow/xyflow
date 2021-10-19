import React, { ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';

import Basic from './Basic';
import UpdateNode from './UpdateNode';
import Stress from './Stress';
import CustomNode from './CustomNode';

import './index.css';

const routes = [
  {
    path: '/basic',
    component: Basic,
  },
  {
    path: '/update-node',
    component: UpdateNode,
  },
  {
    path: '/stress',
    component: Stress,
  },
  {
    path: '/custom-node',
    component: CustomNode,
  },
];

const Header = withRouter(({ history, location }) => {
  const onChange = (event: ChangeEvent<HTMLSelectElement>) => history.push(event.target.value);

  return (
    <header>
      <a className="logo" href="https://github.com/wbkd/react-flow">
        React Flow Dev
      </a>
      <select defaultValue={location.pathname} onChange={onChange}>
        {routes.map((route) => (
          <option value={route.path} key={route.path}>
            {route.path === '/' ? 'overview' : route.path.substr(1, route.path.length)}
          </option>
        ))}
      </select>
    </header>
  );
});

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
