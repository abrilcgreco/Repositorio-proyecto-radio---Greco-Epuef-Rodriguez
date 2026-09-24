import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { Seccion } from "../../data/usuarios";
import "./AdminLayout.css";

interface ItemMenu {
  clave: Seccion;
  ruta: string;
  etiqueta: string;
}

const secciones: ItemMenu[] = [
  { clave: "musica", ruta: "/admin/musica", etiqueta: "Música" },
  {
    clave: "producciones",
    ruta: "/admin/producciones",
    etiqueta: "Producciones",
  },
  { clave: "noticias", ruta: "/admin/noticias", etiqueta: "Noticias" },
  { clave: "usuarios", ruta: "/admin/usuarios", etiqueta: "Usuarios y roles" },
];

export default function AdminLayout() {
  const { logout, tienePermiso } = useAuth();
  const navigate = useNavigate();

  function salir(): void {
    logout();
    navigate("/login", { replace: true });
  }

  const visibles = secciones.filter((s) => tienePermiso(s.clave));

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <img src="/logo.png" alt="Radio Escolar" className="admin-logo" />
        <button className="admin-salir" onClick={salir}>
          Salir de administrador
        </button>
      </header>

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

      <footer className="admin-pie">
        <div className="admin-pie-grid">
          <div>
            <h4 className="pie-naranja">Sobre Nosotros</h4>
            <p>
              Somos un taller de multimedios de la E.S.E.T.P. Nº724, sonamos
              todos los días a toda hora con música, ideas y compañía para toda
              la comunidad.
            </p>
          </div>
          <div>
            <h4 className="pie-amarillo">Redes</h4>
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Sitio insitucional</a>
          </div>
          <div>
            <h4 className="pie-rojo">Categorías</h4>
            <a href="#">Inicio</a>
            <a href="#">Categorías</a>
            <a href="#">Novedades</a>
          </div>
        </div>
        <p className="admin-pie-legal">
          Taller de Multimedios E.S.E.T.P N724 - Radio Escolar
        </p>
      </footer>
    </div>
  );
}