import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Seccion } from "../data/usuarios";

interface RutaProtegidaProps {

  seccion?: Seccion;
}

export default function RutaProtegida({ seccion }: RutaProtegidaProps) {
  const { usuario, cargando, tienePermiso } = useAuth();
  const location = useLocation();

  if (cargando) {
    return <p style={{ padding: "2rem" }}>Cargando…</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" state={{ desde: location.pathname }} replace />;
  }

  // Hay sesión pero el rol no alcanza: lo mandamos al inicio del panel.
  if (seccion && !tienePermiso(seccion)) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}