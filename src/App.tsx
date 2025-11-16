import { Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import Auth from "./pages/auth";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { ProviderReviewPage } from "./pages/ProviderReviewPage"; // <-- nova página

const App = () => {
  return (
    <Routes>
      {/* Home / Landing */}
      <Route path="/" element={<Index />} />

      {/* Autenticação */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/register" element={<Register />} />

      {/* Área logada */}
      <Route path="/profile" element={<Profile />} />

      {/* ✨ Rota nova — Avaliação do prestador ✨ */}
      <Route
        path="/prestadores/:providerId/avaliar"
        element={<ProviderReviewPage />}
      />

      {/* Rotas antigas mantidas por compatibilidade */}
      <Route path="/login" element={<Auth />} />
      <Route path="/index" element={<Index />} />

      {/* Fallback: qualquer rota desconhecida volta pra home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
