import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { roles } from "../../data/usuarios";
import { categorias } from "../../data/categorias";
import type { TrackConDuracion } from "../../data/playlist";
import { obtenerPlaylist, esEditable } from "../../data/playlistStore";
import { usePerfil } from "./perfil";

// Misma fecha de arranque que usa el reproductor (ReproductorContext) para calcular qué está al aire.
const RADIO_START = new Date("2026-01-01T00:00:00").getTime();

function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

// Qué canción está sonando ahora en la emisora de un género, y en qué segundo va.
function calcularAlAire(lista: TrackConDuracion[], ahora: number) {
  const total = lista.reduce((acc, t) => acc + t.duracionSegundos, 0);
  if (lista.length === 0 || total === 0) return null;
  const transcurridos = Math.floor((ahora - RADIO_START) / 1000) % total;
  let acumulado = 0;
  for (const track of lista) {
    if (transcurridos < acumulado + track.duracionSegundos) {
      return { track, segundo: transcurridos - acumulado };
    }
    acumulado += track.duracionSegundos;
  }
  return { track: lista[0], segundo: 0 };
}

function formatearTiempo(segundos: number): string {
  const m = Math.floor(segundos / 60);
  const s = Math.floor(segundos % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatearTotal(segundos: number): string {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  return h > 0 ? `${h} h ${m} min` : `${m} min`;
}

export default function AdminInicio() {
  const { usuario, tienePermiso } = useAuth();
  const { perfil } = usePerfil();
  const [ahora, setAhora] = useState<number>(Date.now());

  // Se actualiza cada segundo para que "Sonando ahora" avance como en la radio.
  useEffect(() => {
    const intervalo = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  const playlist = obtenerPlaylist();
  const duracionTotal = playlist.reduce((acc, t) => acc + t.duracionSegundos, 0);
  const cargadasEnPanel = playlist.filter((t) => esEditable(t.url)).length;

  const emisoras = categorias.map((genero) => {
    const lista = playlist.filter((t) => normalizar(t.categoria) === normalizar(genero));
    return {
      genero,
      cantidad: lista.length,
      duracion: lista.reduce((acc, t) => acc + t.duracionSegundos, 0),
      alAire: calcularAlAire(lista, ahora),
    };
  });

  const vacias = emisoras.filter((e) => e.cantidad === 0);
  const activas = emisoras.length - vacias.length;
  const puedeCargar = tienePermiso("musica");

  return (
    <div className="admin-pagina">
      <div className="admin-pagina-encabezado">
        <div>
          <h1 className="admin-titulo">Panel</h1>
          <p className="admin-subtitulo">
            Hola, {perfil.nombreVisible || usuario?.nombre}. Ingresaste como {usuario ? roles[usuario.rol].etiqueta : ""}.
          </p>
        </div>
        {puedeCargar && (
          <Link to="/admin/musica" className="admin-boton">
            + Agregar canción
          </Link>
        )}
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <p className="admin-stat-etiqueta">Canciones en total</p>
          <p className="admin-stat-valor">{playlist.length}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat-etiqueta">Emisoras con música</p>
          <p className="admin-stat-valor">
            {activas}
            <span> / {emisoras.length}</span>
          </p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat-etiqueta">Duración de la programación</p>
          <p className="admin-stat-valor">{formatearTotal(duracionTotal)}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat-etiqueta">Cargadas desde el panel</p>
          <p className="admin-stat-valor">{cargadasEnPanel}</p>
        </div>
      </div>

      {vacias.length > 0 ? (
        <div className="admin-aviso">
          <p>
            <strong>{vacias.length === 1 ? "Hay 1 emisora sin canciones" : `Hay ${vacias.length} emisoras sin canciones`}:</strong>{" "}
            {vacias.map((e) => e.genero).join(", ")}. Mientras no tengan música, no suenan en Categorías.
          </p>
          {puedeCargar && (
            <Link to="/admin/musica" className="admin-aviso-link">
              Cargar canciones
            </Link>
          )}
        </div>
      ) : (
        <div className="admin-aviso admin-aviso--ok">
          <p>Todas las emisoras tienen música cargada.</p>
        </div>
      )}

      <section className="admin-tarjeta">
        <div className="admin-tarjeta-encabezado">
          <h2>Emisoras por género</h2>
          <p>Lo que está sonando ahora mismo en cada género de la sección Categorías.</p>
        </div>

        <div className="admin-tabla-wrap">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Género</th>
                <th>Estado</th>
                <th>Sonando ahora</th>
                <th className="admin-num">Canciones</th>
                <th className="admin-num">Duración</th>
              </tr>
            </thead>
            <tbody>
              {emisoras.map((e) => (
                <tr key={e.genero}>
                  <td className="admin-celda-fuerte">{e.genero}</td>
                  <td>
                    {e.alAire ? (
                      <span className="admin-estado admin-estado--aire">
                        <span className="admin-estado-punto" />
                        Al aire
                      </span>
                    ) : (
                      <span className="admin-estado admin-estado--vacia">Sin canciones</span>
                    )}
                  </td>
                  <td>
                    {e.alAire ? (
                      <div className="admin-sonando">
                        <p className="admin-sonando-nombre">
                          {e.alAire.track.nombre}
                          <span> · {e.alAire.track.artista}</span>
                        </p>
                        <div className="admin-sonando-progreso">
                          <div className="admin-sonando-barra">
                            <div
                              className="admin-sonando-relleno"
                              style={{ width: `${(e.alAire.segundo / e.alAire.track.duracionSegundos) * 100}%` }}
                            />
                          </div>
                          <span>
                            {formatearTiempo(e.alAire.segundo)} / {formatearTiempo(e.alAire.track.duracionSegundos)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="admin-apagado">—</span>
                    )}
                  </td>
                  <td className="admin-num">{e.cantidad}</td>
                  <td className="admin-num">{e.cantidad > 0 ? formatearTotal(e.duracion) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="admin-nota">
          En el Inicio del sitio suena un mix aleatorio con todas las canciones de todos los géneros.
        </p>
      </section>
    </div>
  );
}