import React, { ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';

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
import FloatingEdges from './FloatingEdges';
import NodeTypeChange from './NodeTypeChange';
import NodeTypesObjectChange from './NodeTypesObjectChange';
import UpdatableEdge from './UpdatableEdge';
import UpdateNode from './UpdateNode';
import SaveRestore from './SaveRestore';
import DragNDrop from './DragNDrop';
import Layout from './Layouting';
import SwitchFlows from './Switch';
import UseZoomPanHelper from './UseZoomPanHelper';
import UseUpdateNodeInternals from './UseUpdateNodeInternals';
import Undirectional from './Undirectional';
import MultiFlows from './MultiFlows';
import DragHandle from './DragHandle';

import './index.css';

const routes = [
  {
    path: '/',
    component: Overview,
  },
  {
    path: '/edges',
    component: Edges,
  },
  {
    path: '/custom-node',
    component: CustomNode,
  },
  {
    path: '/validation',
    component: Validation,
  },
  {
    path: '/provider',
    component: Provider,
  },
  {
    path: '/stress',
    component: Stress,
  },
  {
    path: '/interaction',
    component: Interaction,
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
    path: '/floating-edges',
    component: FloatingEdges,
  },
  {
    path: '/nodetype-change',
    component: NodeTypeChange,
  },
  {
    path: '/nodetypesobject-change',
    component: NodeTypesObjectChange,
  },
  {
    path: '/updatable-edge',
    component: UpdatableEdge,
  },
  {
    path: '/update-node',
    component: UpdateNode,
  },
  {
    path: '/save-restore',
    component: SaveRestore,
  },
  {
    path: '/drag-and-drop',
    component: DragNDrop,
  },
  {
    path: '/layouting',
    component: Layout,
  },
  {
    path: '/switch',
    component: SwitchFlows,
  },
  {
    path: '/usezoompanhelper',
    component: UseZoomPanHelper,
  },
  {
    path: '/useupdatenodeinternals',
    component: UseUpdateNodeInternals,
  },
  {
    path: '/undirectional',
    component: Undirectional,
  },
  {
    path: '/multiflows',
    component: MultiFlows,
  },
  {
    path: '/draghandle',
    component: DragHandle,
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
