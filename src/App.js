import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateShop from './components/CreateShop';
import UploadProducts from './components/UploadProducts';
import VerifyArtisan from './components/verifyArtisan';
import Login from './components/Login';
import DashBoard from './components/Dashboard';
import Artists from './components/Artists';
import Signup from './components/Signup';
import TermsAndConditions from './components/TermsAndConditions';
import Store from './components/Store';
import CardCreator from './components/CardCreator';

const App = () => {
  return (
    <Routes>
      <Route path="/Homepage" element={<HomePage />} />
      <Route path="/CreateShop" element={<CreateShop />} />
      <Route path="/UploadProducts" element={<UploadProducts/>} />
      <Route path="/verifyArtisan" element={<VerifyArtisan/>} />
      <Route path="/Login" element={<Login/>} />
      <Route path="/Artists" element={<Artists />} />
      <Route path="/Artists/:id" element={<Store />} />
      <Route path="/Dashboard" element={<DashBoard/>}/>
      <Route path="/Signup" element={<Signup/>}/>
      <Route path="/TermsAndConditions" element={<TermsAndConditions/>}/>
      <Route path="/CardCreator" element={<CardCreator />} />
      <Route path="/" element={<HomePage />} />
    
     </Routes>
  );
};

export default App;
