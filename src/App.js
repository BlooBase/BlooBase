import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import DashBoard from './components/Dashboard';
import Artists from './components/Artists';
import Signup from './components/Signup';
import BuyerHomePage from './components/BuyerHomePage';
import { useAuth } from './components/AuthContext'; 
import TermsAndConditions from './components/TermsAndConditions';
import Store from './components/Store';
import CardCreator from './components/CardCreator';
import SellerHomePage from './components/SellerHomepage';
import Cart from './components/Cart';
import Orders from './components/Orders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  //const { currentUser, userRole, loading } = useAuth();
  

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole, loading } = useAuth(); 

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  // --- Authentication Check ---
  if (!currentUser) {
    return <Navigate to="/Login" replace />;
  }

  // --- Role Check ---
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/Homepage" replace />;
  }

  // If authenticated and authorized, render children
  return children;
};

  return (
    <>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/Homepage" element={<HomePage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Artists" element={<Artists />} />
        <Route path="/Artists/:id" element={<Store />} />
        <Route path="/TermsAndConditions" element={<TermsAndConditions />} />

        {/* --- Authenticated Routes with Role Protection --- */}

        {/* SellerHomepage only open to Seller */}
        <Route path="/SellerHomepage" element={<ProtectedRoute allowedRoles={['Seller']}><SellerHomePage /></ProtectedRoute>} />

        {/* BuyerHomepage only open to Buyer */}
        <Route path="/BuyerHomepage" element={<ProtectedRoute allowedRoles={['Buyer']}><BuyerHomePage /></ProtectedRoute>} />

        {/* Orders only open to Buyer and Admin */}
        <Route path="/OrderDetails/:id" element={<ProtectedRoute allowedRoles={['Buyer','Admin']}><Orders /></ProtectedRoute>} />
        
        {/* Dashboard only open to Admin */}
        <Route path="/Dashboard" element={<ProtectedRoute allowedRoles={['Admin']}><DashBoard /></ProtectedRoute>} />

        {/* Cart only open to Buyer */}
        <Route path="/Cart" element={<ProtectedRoute allowedRoles={['Buyer']}><Cart /></ProtectedRoute>} />

        {/* CardCreator only open to Seller */}
        <Route path="/CardCreator" element={<ProtectedRoute allowedRoles={['Seller']}><CardCreator /></ProtectedRoute>} />

        {/* --- Route for fake links --- */}
        <Route path="*" element={<Navigate to="/Homepage" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;