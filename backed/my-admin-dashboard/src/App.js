import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

import LoginPage from './Auth/LoginPage';
import Dashboard from './Compoments/Dashoard';
import Users from './Compoments/Users';
import ProductList from './Compoments/Products ';
import HeaderComponents from './Compoments/HeaderCompomets';
import Sidebar from './Compoments/Sidebar';
import { LayoutProvider } from './Compoments/LayoutContext';
import Layout from './Compoments/Layout';
import BrandList from './Compoments/Brand';
import CategoryList from './Compoments/CategoryList';
import MenuList from './Compoments/MenuList';
import SliderList from './Compoments/SliderList';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 > Date.now() && decodedToken.role && decodedToken.role.includes('Admin')) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Token decoding error:', error);
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<ProductList />} />
          <Route path="brands" element={<BrandList />} />
          <Route path="categorys" element={<CategoryList />} />
          <Route path="menus" element={<MenuList />} />
          <Route path="sliders" element={<SliderList />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
