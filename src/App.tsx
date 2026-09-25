import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RutaProtegida from "./components/RutaProtegida";
import PublicLayout from "./components/layout/PublicLayout";

import Home from "./components/Home";
import Login from "./pages/Login";
import Novedades from "./components/Novedades";
import Categorias from "./components/Categorias";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminInicio from "./pages/admin/AdminInicio";
import MusicaAdmin from "./pages/admin/MusicaAdmin";
import NoticiasAdmin from "./pages/admin/NoticiasAdmin";
import UsuariosAdmin from "./pages/admin/UsuariosAdmin";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/novedades" element={<Novedades />} />
          <Route path="/categorias" element={<Categorias />} />
        </Route>

        <Route path="/login" element={<Login />} />

        <Route element={<RutaProtegida />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminInicio />} />

            <Route element={<RutaProtegida seccion="musica" />}>
              <Route path="musica" element={<MusicaAdmin />} />
            </Route>

            <Route element={<RutaProtegida seccion="noticias" />}>
              <Route path="noticias" element={<NoticiasAdmin />} />
            </Route>

            <Route element={<RutaProtegida seccion="usuarios" />}>
              <Route path="usuarios" element={<UsuariosAdmin />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}