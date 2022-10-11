import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ClientRegistryLaunch from "./client-registry-icon.component";

const ClientRegistryIconWrapper = () => {
  return (
    <BrowserRouter basename={window["getOpenmrsSpaBase"]()}>
      <Routes>
        <Route path=":page/*" element={<ClientRegistryLaunch />} />
      </Routes>
    </BrowserRouter>
  );
};

export default ClientRegistryIconWrapper;
