import React from 'react';
import { Route, BrowserRouter, Routes } from "react-router-dom";

import Form from "./form";

export default function App() {
  return(
    <BrowserRouter>
        <Routes>
            <Route element={<Form />}  path="/" exact />
        </Routes>
    </BrowserRouter>
  );
}