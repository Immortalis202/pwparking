import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import SignIn from './../Components/SignIn/sign-in';

const Root = () => {
  const [user, setUser] = useState("");

  return (
    <>
      {user ? (
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
      ) : (
        <div>
          <SignIn setUser={setUser} />
        </div>
      )}
    </>
  );
};

export default Root;