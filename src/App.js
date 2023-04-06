import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProtectedRoute } from "./auth/protectedRoute";
import Form from "./form";
import Recover from "./recover";
import Scan from "./scan";
import Confirm from "./confirm";
import Admin from "./admin";

export default function App() {
  return(
    <BrowserRouter>
        <Routes>
            <Route element={<Form />}  path="/" exact />
            <Route element={<Recover />}  path="/recover" exact />
            
            <Route element={
              <ProtectedRoute isLogin>
                <Admin />
              </ProtectedRoute>
            }  path="/admin" exact />
            <Route element={
              <ProtectedRoute>
                <Scan />
              </ProtectedRoute>
            }  path="/scan" exact />
            <Route element={
              <ProtectedRoute>
                <Confirm />
              </ProtectedRoute>
            }  path="/confirm/:value" />
        </Routes>
    </BrowserRouter>
  );
}