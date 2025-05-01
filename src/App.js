// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateShop from './components/CreateShop';
import UploadProducts from './components/UploadProducts';
import VerifyArtisan from './components/verifyArtisan';
import Login from './components/Login';
import DashBoard from './components/Dashboard';
import Artists from './components/Artists';
import Signup from './components/Signup';
import BuyerSettings from './components/BuyerSettings';
import BuyerHomePage from './components/BuyerHomePage';
import { useAuth } from './components/AuthContext';

const App = () => {
  const { currentUser } = useAuth();

  const ProtectedRoute = ({ element }) => {
    return currentUser ? element : <Navigate to="/Login" />;
  };

  return (
    <Routes>
      <Route path="/Homepage" element={<HomePage />} />
      <Route path="/BuyerSettings" element={<BuyerSettings />} />
      <Route path="/BuyerHomepage" element={<BuyerHomePage />} />
      <Route path="/CreateShop" element={<ProtectedRoute element={<CreateShop />} />} />
      <Route path="/UploadProducts" element={<ProtectedRoute element={<UploadProducts />} />} />
      <Route path="/verifyArtisan" element={<ProtectedRoute element={<VerifyArtisan />} />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Artists" element={<Artists />} />
      <Route path="/Dashboard" element={<ProtectedRoute element={<DashBoard />} />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default App;
