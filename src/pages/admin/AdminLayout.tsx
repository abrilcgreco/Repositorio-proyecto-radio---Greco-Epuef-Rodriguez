import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { Seccion } from "../../data/usuarios";
import AdminHeader from "../../components/layout/AdminHeader";
import Footer from "../../components/layout/Footer";
import "./AdminLayout.css";

interface ItemMenu {
  clave: Seccion;
  ruta: string;
  etiqueta: string;
}

const secciones: ItemMenu[] = [
  { clave: "musica", ruta: "/admin/musica", etiqueta: "Música" },
  { clave: "noticias", ruta: "/admin/noticias", etiqueta: "Noticias" },
  { clave: "usuarios", ruta: "/admin/usuarios", etiqueta: "Usuarios y roles" },
];

export default function AdminLayout() {
  const { tienePermiso } = useAuth();

  const visibles = secciones.filter((s) => tienePermiso(s.clave));

  return (
    <div className="admin-layout">
      <AdminHeader />

      <div className="admin-cuerpo">
        <aside className="admin-sidebar">
          <p className="admin-sidebar-titulo">Menú administración</p>
          <nav className="admin-nav">
            {visibles.map((s) => (
              <NavLink
                key={s.clave}
                to={s.ruta}
                className={({ isActive }) =>
                  isActive ? "admin-link activo" : "admin-link"
                }
              >
                {s.etiqueta}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="admin-contenido">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}