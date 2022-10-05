import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ClientRegistryPageComponent from './client-registry-page/client-registry-page.component';

const PatientSearchRootComponent: React.FC = () => {
  return (
    <BrowserRouter basename={`${window['getOpenmrsSpaBase']()}search`}>
      <Routes>
        <Route path="" element={<ClientRegistryPageComponent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default PatientSearchRootComponent;
