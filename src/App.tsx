import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RutaProtegida from "./components/RutaProtegida";

import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminInicio from "./pages/admin/AdminInicio";
import MusicaAdmin from "./pages/admin/MusicaAdmin";
import ProduccionesAdmin from "./pages/admin/ProduccionesAdmin";
import NoticiasAdmin from "./pages/admin/NoticiasAdmin";
import UsuariosAdmin from "./pages/admin/UsuariosAdmin";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ---- Parte pública ---- */}
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/login" element={<Login />} />

          {/* ---- Panel de administración ---- */}
          <Route element={<RutaProtegida />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminInicio />} />

              <Route element={<RutaProtegida seccion="musica" />}>
                <Route path="musica" element={<MusicaAdmin />} />
              </Route>

              <Route element={<RutaProtegida seccion="producciones" />}>
                <Route path="producciones" element={<ProduccionesAdmin />} />
              </Route>

              <Route element={<RutaProtegida seccion="noticias" />}>
                <Route path="noticias" element={<NoticiasAdmin />} />
              </Route>

              <Route element={<RutaProtegida seccion="usuarios" />}>
                <Route path="usuarios" element={<UsuariosAdmin />} />
              </Route>
            </Route>
          </Route>

          {/* Cualquier ruta desconocida */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
