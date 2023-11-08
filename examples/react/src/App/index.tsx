import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import routes from './routes';
import GenericTestRoutes from '../generic-tests';
import Basic from '../examples/Basic';
import Header from './header';

export default () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/examples" />} />
      <Route path="examples" element={<Header />}>
        <Route index element={<Basic />} />
        {routes.map((route) => (
          <Route path={route.path} key={route.path} element={<route.component />} />
        ))}
      </Route>
      <Route path="tests/generic/*" element={<GenericTestRoutes />} />
    </Routes>
  </BrowserRouter>
);
