import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateShop from './components/CreateShop';
import UploadProducts from './components/UploadProducts';
import VerifyArtisan from './components/verifyArtisan';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/CreateShop" element={<CreateShop />} />
      <Route path="/UploadProducts" element={<UploadProducts/>} />
      <Route path="/verifyArtisan" element={<VerifyArtisan/>} />

    </Routes>
  );
};

export default App;
