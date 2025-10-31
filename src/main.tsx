import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App"; // Página de login
import Register from "./pages/Register"; // Nova página de cadastro
import Index from "./pages/Index"; // Página principal após login
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Página inicial → Registro */}
        <Route path="/" element={<Navigate to="/register" />} />

        {/* Rotas principais */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<App />} />
        <Route path="/index" element={<Index />} />

        {/* Rota fallback */}
        <Route path="*" element={<Navigate to="/register" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
