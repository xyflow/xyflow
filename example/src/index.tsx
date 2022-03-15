import { ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Basic from './Basic';
import ControlledUncontrolled from './ControlledUncontrolled';
import CustomConnectionLine from './CustomConnectionLine';
import CustomNode from './CustomNode';
import DefaultNodes from './DefaultNodes';
import DragHandle from './DragHandle';
import DragNDrop from './DragNDrop';
import Edges from './Edges';
import EdgeTypes from './EdgeTypes';
import Empty from './Empty';
import FloatingEdges from './FloatingEdges';
import Hidden from './Hidden';
import './index.css';
import Interaction from './Interaction';
import Layouting from './Layouting';
import MultiFlows from './MultiFlows';
import NestedNodes from './NestedNodes';
import NodeTypeChange from './NodeTypeChange';
import NodeTypesObjectChange from './NodeTypesObjectChange';
import Overview from './Overview';
import Provider from './Provider';
import SaveRestore from './SaveRestore';
import Stress from './Stress';
import Subflow from './Subflow';
import SwitchFlow from './Switch';
import TouchDevice from './TouchDevice';
import Undirectional from './Undirectional';
import UpdatableEdge from './UpdatableEdge';
import UpdateNode from './UpdateNode';
import UseUpdateNodeInternals from './UseUpdateNodeInternals';
import UseReactFlow from './UseReactFlow';
import Validation from './Validation';

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
    path: '/default-nodes',
    component: DefaultNodes,
  },
  {
    path: '/custom-connectionline',
    component: CustomConnectionLine,
  },
  {
    path: '/custom-node',
    component: CustomNode,
  },
  {
    path: '/draghandle',
    component: DragHandle,
  },
  {
    path: '/dragndrop',
    component: DragNDrop,
  },
  {
    path: '/edges',
    component: Edges,
  },
  {
    path: '/edge-types',
    component: EdgeTypes,
  },
  {
    path: '/empty',
    component: Empty,
  },
  {
    path: '/floating-edges',
    component: FloatingEdges,
  },
  {
    path: '/hidden',
    component: Hidden,
  },
  {
    path: '/interaction',
    component: Interaction,
  },
  {
    path: '/layouting',
    component: Layouting,
  },
  {
    path: '/multiflows',
    component: MultiFlows,
  },
  {
    path: '/nested-nodes',
    component: NestedNodes,
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
    path: '/provider',
    component: Provider,
  },
  {
    path: '/save-restore',
    component: SaveRestore,
  },
  {
    path: '/stress',
    component: Stress,
  },
  {
    path: '/subflow',
    component: Subflow,
  },
  {
    path: '/switch',
    component: SwitchFlow,
  },
  {
    path: '/touch-device',
    component: TouchDevice,
  },
  {
    path: '/undirectional',
    component: Undirectional,
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
    path: '/usereactflow',
    component: UseReactFlow,
  },
  {
    path: '/useupdatenodeinternals',
    component: UseUpdateNodeInternals,
  },
  {
    path: '/validation',
    component: Validation,
  },
  {
    path: '/controlled-uncontrolled',
    component: ControlledUncontrolled,
  },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const onChange = (event: ChangeEvent<HTMLSelectElement>) => navigate(event.target.value);

  return (
    <header>
      <a className="logo" href="https://github.com/wbkd/react-flow">
        React Flow Dev
      </a>
      <select defaultValue={location.pathname} onChange={onChange}>
        {routes.map((route) => (
          <option value={route.path} key={route.path}>
            {route.path === '/' ? 'overview' : route.path.substring(1, route.path.length)}
          </option>
        ))}
      </select>
    </header>
  );
};

ReactDOM.render(
  <BrowserRouter>
    <Header />
    <Routes>
      {routes.map((route) => (
        <Route path={route.path} key={route.path} element={<route.component />} />
      ))}
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);
