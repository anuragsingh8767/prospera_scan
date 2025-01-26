import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SidebarMenu from './components/SidebarMenu/SidebarMenu';
import Menubar from './components/Menubar/Menubar';
import AppRoutes from './routes';
import Login from './Pages/Login'
import './App.css';
import SignUpPage from './Pages/SignUpPage';

function App() {
  const authStatus = useSelector((state) => state.auth.Auth);

  return (
    <Router>
      <div className="app-container">
      {authStatus === 'true' ? ( 
        <>
          <Menubar />
          <div className="content-wrapper">
            <SidebarMenu />
            <div className="main-content">
              <AppRoutes />
            </div>
          </div>
        </>
     ) : ( 
      <Routes>
         <Route path="/" element={<Login />} />
         <Route path="/signup" element={<SignUpPage />} />
      </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
