import React from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';

const routes = [
  '/',
  '/ControlledUncontrolled',
  '/CustomConnectionLine',
  '/CustomNode',
  '/DefaultNodes',
  '/DragHandle',
  '/DragNDrop',
  '/EdgeTypes',
  '/Edges',
  '/Empty',
  '/FloatingEdges',
  '/Hidden',
  '/Interaction',
  '/Layouting',
  '/MultiFlows',
  '/NestedNodes',
  '/NodeTypeChange',
  '/NodeTypesObjectChange',
  '/Overview',
  '/Provider',
  '/SaveRestore',
  '/Stress',
  '/Subflow',
  '/Switch',
  '/TouchDevice',
  '/Undirectional',
  '/UpdatableEdge',
  '/UpdateNode',
  '/UseKeyPress',
  '/UseReactFlow',
  '/UseUpdateNodeInternals',
  '/Validation',
];

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const onRouteChange = (evt) => {
    router.push(evt.target.value);
  };

  return (
    <>
      <header>
        <a className='logo' href='https://github.com/wbkd/react-flow'>
          React Flow Dev
        </a>
        <select defaultValue={router.pathname} onChange={onRouteChange}>
          {routes.map((route) => (
            <option value={route} key={route}>
              {route === '/' ? 'Basic' : route.substring(1, route.length)}
            </option>
          ))}
        </select>
      </header>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
