import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import routes from './routes';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathParts = location.pathname.split('/').filter(Boolean);
  const initialExample = pathParts.length > 1 ? pathParts[1] : 'basic';

  const [currentPath, setCurrentPath] = useState(initialExample);

  useEffect(() => {
    const name = routes.find((route) => route.path === currentPath)?.name;
    document.title = `React Flow Examples${name ? ' - ' + name : ''}`;
    navigate(currentPath);
  }, [currentPath, navigate]);

  return (
    <>
      <header>
        <a className="logo" href="https://github.com/xyflow/xyflow">
          React Flow Dev
        </a>
        <select
          value={currentPath}
          onChange={(event) => setCurrentPath(event.target.value)}
          aria-label="select an example"
        >
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
