import { Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import Auth from "./pages/auth";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProviderReviewPage from "./pages/ProviderReviewPage"; // ⭐ CORRETO AQUI

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/register" element={<Register />} />

      {/* Área logada */}
      <Route path="/profile" element={<Profile />} />

      {/* Avaliação do prestador */}
      <Route
        path="/prestadores/:providerId/avaliar"
        element={<ProviderReviewPage />}
      />

      <Route path="/login" element={<Auth />} />
      <Route path="/index" element={<Index />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
