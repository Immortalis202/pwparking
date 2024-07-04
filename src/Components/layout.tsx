import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/navbar';
import exp from 'constants';

const Layout: React.FC = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
export default  Layout;