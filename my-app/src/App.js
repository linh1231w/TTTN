import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LayoutSite from './components/compomentsUI';

import RouterPublic from './router/RouterPublic';

import LoginPage from './pages/frontend/Login';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <>
    <BrowserRouter>
    {/* <UserProvider> */}
                  <Routes>
                     
                      <Route path="/" element={<LayoutSite />}>
                        {RouterPublic.map(function(router,index){
                           const Page=router.component;
                          return(    
                            <Route key={index} path={router.path} element={<Page />} />
                          );      
                        })}
                    
                      </Route>               
                      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />


                   {/* Routes dành cho quản trị viên */}
                   {/* <Route path="/admin" element={
          <div style={{ display: 'flex' }}>
            <AdminSidebar />
            <div style={{ flexGrow: 1 }}>
              <AdminHeader />
              <AdminDashboard />
            </div>
          </div>
        } /> */}
        </Routes>
    {/* </UserProvider>     */}
   
    </BrowserRouter>
  
  </>
    );
}

export default App;
