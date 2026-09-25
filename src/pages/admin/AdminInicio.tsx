import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { roles } from "../../data/usuarios";
import { usuarios } from "../../data/usuarios";
import { obtenerPlaylist } from "../../data/playlistStore";
import { obtenerNoticias } from "../../data/noticiasStore";

export default function AdminInicio() {
  const { usuario, tienePermiso } = useAuth();
  const navigate = useNavigate();

  const tarjetas = [
    {
      seccion: "musica" as const,
      titulo: "Música",
      ruta: "/admin/musica",
      cantidad: obtenerPlaylist().length,
      etiqueta: "canciones cargadas",
    },
    {
      seccion: "noticias" as const,
      titulo: "Noticias",
      ruta: "/admin/noticias",
      cantidad: obtenerNoticias().length,
      etiqueta: "noticias publicadas",
    },
    {
      seccion: "usuarios" as const,
      titulo: "Usuarios y roles",
      ruta: "/admin/usuarios",
      cantidad: usuarios.length,
      etiqueta: "usuarios registrados",
    },
  ];

  const visibles = tarjetas.filter((t) => tienePermiso(t.seccion));

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Hola, {usuario?.nombre}</h1>
      <p style={{ color: "#a09cb5", marginBottom: "2rem" }}>
        Ingresaste como{" "}
        <strong>{usuario ? roles[usuario.rol].etiqueta : ""}</strong>. Elegí una
        sección para empezar.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {visibles.map((t) => (
          <button
            key={t.seccion}
            onClick={() => navigate(t.ruta)}
            style={{
              textAlign: "left",
              cursor: "pointer",
              border: "none",
              borderRadius: "10px",
              padding: "1.5rem",
              background: "#1e1b2e",
              color: "#fff",
            }}
          >
            <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem" }}>{t.titulo}</h2>
            <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>{t.cantidad}</p>
            <p style={{ margin: 0, color: "#a09cb5", fontSize: "0.9rem" }}>{t.etiqueta}</p>
          </button>
        ))}
      </div>
    </div>
  );
}