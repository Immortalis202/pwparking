import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext.tsx';
import Layout from './Components/layout.tsx';
import Home from './routes/root';

import Profile from './routes/profilo.js';
import Login from './Components/SignIn/sign-in.tsx';
import MapG from "./Components/map.tsx"
import PrivateRoute from './PrivateRoute.js';
import ParkingTicket from './Components/ticket.tsx'; 




const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="maps" element={<MapG/>}/>
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<PrivateRoute><ParkingTicket /></PrivateRoute>} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;