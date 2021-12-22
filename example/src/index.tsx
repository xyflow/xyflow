import { ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';

import Overview from './Overview';
import Basic from './Basic';
import UpdateNode from './UpdateNode';
import Stress from './Stress';
import CustomNode from './CustomNode';
import FloatingEdges from './FloatingEdges';
import Layouting from './Layouting';
import NestedNodes from './NestedNodes';
import Hidden from './Hidden';
import UpdatableEdge from './UpdatableEdge';
import TouchDevice from './TouchDevice';
import Subflow from './Subflow';
import Interaction from './Interaction';
import Empty from './Empty';
import DragHandle from './DragHandle';
import Undirectional from './Undirectional';
import Provider from './Provider';
import CustomConnectionLine from './CustomConnectionLine';
import UseZoomPanHelper from './UseZoomPanHelper';

import './index.css';

const routes = [
  {
    path: '/',
    component: Overview,
  },
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
  {
    path: '/floating-edges',
    component: FloatingEdges,
  },
  {
    path: '/layouting',
    component: Layouting,
  },
  {
    path: '/nested-nodes',
    component: NestedNodes,
  },
  {
    path: '/hidden',
    component: Hidden,
  },
  {
    path: '/updatable-edge',
    component: UpdatableEdge,
  },
  {
    path: '/touch-device',
    component: TouchDevice,
  },
  {
    path: '/subflow',
    component: Subflow,
  },
  {
    path: '/interaction',
    component: Interaction,
  },
  {
    path: '/empty',
    component: Empty,
  },
  {
    path: '/draghandle',
    component: DragHandle,
  },
  {
    path: '/undirectional',
    component: Undirectional,
  },
  {
    path: '/provider',
    component: Provider,
  },
  {
    path: '/custom-connectionline',
    component: CustomConnectionLine,
  },
  {
    path: '/usezoompanhelper',
    component: UseZoomPanHelper,
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
  <Router>
    <Header />
    <Switch>
      {routes.map((route) => (
        <Route exact path={route.path} render={() => <route.component />} key={route.path} />
      ))}
    </Switch>
  </Router>,
  document.getElementById('root')
);
