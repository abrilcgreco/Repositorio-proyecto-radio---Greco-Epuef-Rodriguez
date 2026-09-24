import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ReproductorProvider } from "./context/ReproductorContext";
import RutaProtegida from "./components/RutaProtegida";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminInicio from "./pages/admin/AdminInicio";
import MusicaAdmin from "./pages/admin/MusicaAdmin";
import ProduccionesAdmin from "./pages/admin/ProduccionesAdmin";
import NoticiasAdmin from "./pages/admin/NoticiasAdmin";
import UsuariosAdmin from "./pages/admin/UsuariosAdmin";
import PublicLayout from "./components/layout/PublicLayout";
import Home from "./components/Home";
import Categorias from "./components/Categorias";
import Novedades from "./components/Novedades";

export default function App() {
  return (
    <AuthProvider>
      <ReproductorProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Categorias />} />
            <Route path="/contact" element={<Novedades />} />
          </Route>

          <Route path="/login" element={<Login />} />

          <Route element={<RutaProtegida />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminInicio />} />
              <Route path="musica" element={<MusicaAdmin />} />
              <Route path="producciones" element={<ProduccionesAdmin />} />
              <Route path="noticias" element={<NoticiasAdmin />} />
              <Route path="usuarios" element={<UsuariosAdmin />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ReproductorProvider>
    </AuthProvider>
  );
}