import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import routes from './routes';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    const name = routes.find((route) => route.path === currentPath)?.name;
    document.title = `React Flow Examples${name ? ' - ' + name : ''}`;
    navigate(currentPath);
  }, [currentPath]);

  return (
    <>
      <header>
        <a className="logo" href="https://github.com/xyflow/xyflow">
          React Flow Dev
        </a>
        <select value={currentPath} onChange={(event) => setCurrentPath(event.target.value)}>
          {routes.map((route) => (
            <option value={route.path} key={route.path}>
              {route.name}
            </option>
          ))}
        </select>
      </header>
      <Outlet />
    </>
  );
}
