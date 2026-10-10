import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { roles } from "../../data/usuarios";
import AdminHeader from "../../components/layout/AdminHeader";
import { leerPerfil, escribirPerfil, type Perfil, type ContextoPerfil } from "./perfil";
import "./AdminLayout.css";

function IconoPanel() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    </svg>
  );
}

function IconoMusica() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
    </svg>
  );
}

function claseLink({ isActive }: { isActive: boolean }) {
  return isActive ? "admin-link activo" : "admin-link";
}

export default function AdminLayout() {
  const { usuario, tienePermiso } = useAuth();
  const clave = usuario?.nombre ?? "invitado";

  const [perfil, setPerfil] = useState<Perfil>(() => leerPerfil(clave, usuario?.nombre ?? ""));

  function guardarPerfil(nuevo: Perfil): void {
    setPerfil(nuevo);
    escribirPerfil(clave, nuevo);
  }

  const rol = usuario ? roles[usuario.rol].etiqueta : "";
  const nombre = perfil.nombreVisible.trim() || usuario?.nombre || "";
  const inicial = nombre.charAt(0).toUpperCase() || "?";
  const contexto: ContextoPerfil = { perfil, guardarPerfil };

  return (
    <div className="admin-layout">
      <AdminHeader />

      <div className="admin-cuerpo">
        <aside className="admin-sidebar">
          <p className="admin-sidebar-titulo">Administración</p>
          <nav className="admin-nav">
            <NavLink to="/admin" end className={claseLink}>
              <IconoPanel />
              Panel
            </NavLink>
            {tienePermiso("musica") && (
              <NavLink to="/admin/musica" className={claseLink}>
                <IconoMusica />
                Biblioteca musical
              </NavLink>
            )}
          </nav>

          <NavLink to="/admin/perfil" className="admin-usuario" title="Editar mi perfil">
            {perfil.foto ? (
              <img src={perfil.foto} alt="" className="admin-avatar" />
            ) : (
              <span className="admin-avatar" aria-hidden="true">{inicial}</span>
            )}
            <div className="admin-usuario-datos">
              <p className="admin-usuario-nombre">{nombre}</p>
              <p className="admin-usuario-rol">{perfil.cargo.trim() || rol}</p>
            </div>
          </NavLink>
        </aside>

        <main className="admin-contenido">
          <Outlet context={contexto} />
        </main>
      </div>
    </div>
  );
}