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
import TermsAndConditions from './components/TermsAndConditions';
import Store from './components/Store';
import CardCreator from './components/CardCreator';
import SellerHomePage from './components/SellerHomepage';
import SellerSettings from './components/SellerSettings';
import Cart from './components/Cart'; // Import the Cart component
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  const { currentUser } = useAuth();

  const ProtectedRoute = ({ element }) => {
    return currentUser ? element : <Navigate to="/Homepage" />;
  };

  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Homepage" element={<HomePage />} />
      <Route path="/CreateShop" element={<ProtectedRoute element={<CreateShop />} />} />
      <Route path="/UploadProducts" element={<ProtectedRoute element={<UploadProducts />} />} />
      <Route path="/verifyArtisan" element={<ProtectedRoute element={<VerifyArtisan />} />} />
      <Route path="/SellerHomepage" element = {<ProtectedRoute element ={<SellerHomePage/>}/>}/>
      <Route path="/SellerSettings" element = {<ProtectedRoute element ={<SellerSettings/>}/>}/>
      <Route path="/BuyerSettings" element={<ProtectedRoute element ={<BuyerSettings/>} />} />
      <Route path="/BuyerHomepage" element={<ProtectedRoute element ={<BuyerHomePage/>} />} />
      <Route path="/Dashboard" element={<ProtectedRoute element ={<DashBoard />}/>} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Artists" element={<Artists />} />
      <Route path="/Artists/:id" element={<Store />} />
      <Route path="/Cart" element={<Cart />} /> {/* Add the Cart route */}
      <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
      <Route path="/CardCreator" element={<CardCreator />} />
    </Routes>
          <ToastContainer />
    </>
  );
};

export default App;
