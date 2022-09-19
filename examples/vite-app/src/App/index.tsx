import { ChangeEvent } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Basic from '../examples/Basic';
import Backgrounds from '../examples/Backgrounds';
import ControlledUncontrolled from '../examples/ControlledUncontrolled';
import CustomConnectionLine from '../examples/CustomConnectionLine';
import CustomNode from '../examples/CustomNode';
import DefaultNodes from '../examples/DefaultNodes';
import DragHandle from '../examples/DragHandle';
import DragNDrop from '../examples/DragNDrop';
import Edges from '../examples/Edges';
import EdgeTypes from '../examples/EdgeTypes';
import Empty from '../examples/Empty';
import FloatingEdges from '../examples/FloatingEdges';
import Hidden from '../examples/Hidden';
import Interaction from '../examples/Interaction';
import Layouting from '../examples/Layouting';
import MultiFlows from '../examples/MultiFlows';
import NestedNodes from '../examples/NestedNodes';
import NodeTypeChange from '../examples/NodeTypeChange';
import NodeTypesObjectChange from '../examples/NodeTypesObjectChange';
import Overview from '../examples/Overview';
import Provider from '../examples/Provider';
import SaveRestore from '../examples/SaveRestore';
import Stress from '../examples/Stress';
import Subflow from '../examples/Subflow';
import SwitchFlow from '../examples/Switch';
import TouchDevice from '../examples/TouchDevice';
import Undirectional from '../examples/Undirectional';
import UpdatableEdge from '../examples/UpdatableEdge';
import UpdateNode from '../examples/UpdateNode';
import UseUpdateNodeInternals from '../examples/UseUpdateNodeInternals';
import UseReactFlow from '../examples/UseReactFlow';
import Validation from '../examples/Validation';
import UseKeyPress from '../examples/UseKeyPress';
import EdgeRouting from '../examples/EdgeRouting';

const routes = [
  {
    path: '/',
    component: Basic,
  },
  {
    path: '/backgrounds',
    component: Backgrounds,
  },
  {
    path: '/controlled-uncontrolled',
    component: ControlledUncontrolled,
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
    path: '/default-nodes',
    component: DefaultNodes,
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
    path: '/edge-routing',
    component: EdgeRouting,
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
    path: '/overview',
    component: Overview,
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
    path: '/use-key-press',
    component: UseKeyPress,
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
            {route.path === '/' ? 'basic' : route.path.substring(1, route.path.length)}
          </option>
        ))}
      </select>
    </header>
  );
};

export default () => (
  <BrowserRouter>
    <Header />
    <Routes>
      {routes.map((route) => (
        <Route path={route.path} key={route.path} element={<route.component />} />
      ))}
    </Routes>
  </BrowserRouter>
);
