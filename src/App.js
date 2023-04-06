import React from 'react';
import { Route, BrowserRouter, Routes } from "react-router-dom";

import Form from "./form";
import Recover from "./recover";
import Scan from "./scan";
import Confirm from "./confirm";

export default function App() {
  return(
    <BrowserRouter>
        <Routes>
            <Route element={<Form />}  path="/" exact />
            <Route element={<Recover />}  path="/recover" exact />
            <Route element={<Scan />}  path="/scan" exact />
            <Route element={<Confirm />}  path="/confirm/:value" />
        </Routes>
    </BrowserRouter>
  );
}