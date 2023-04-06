import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProtectedRoute } from "./auth/protectedRoute";
import Form from "./pages/form";
import Recover from "./pages/recover";
import Scan from "./pages/scan";
import Confirm from "./pages/confirm";
import Admin from "./pages/admin";

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