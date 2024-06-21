import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Root = () => {
  return (
    <div className="container">
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/statistiche">Statistiche</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default Root;