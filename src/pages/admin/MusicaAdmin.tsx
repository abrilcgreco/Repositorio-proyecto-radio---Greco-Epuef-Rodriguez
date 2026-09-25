import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { TrackConDuracion } from "../../data/playlist";
import { categorias } from "../../data/categorias";
import {
  obtenerPlaylist,
  agregarCancion,
  eliminarCancion,
  esEditable,
} from "../../data/playlistStore";
import "../../components/admin/ModuloAdmin.css";

type Valores = {
  nombre: string;
  artista: string;
  categoria: string;
  url: string;
};

const vacio: Valores = { nombre: "", artista: "", categoria: "", url: "" };

function esFormatoValido(url: string): boolean {
  return /\.(mp3|mp4)(\?.*)?$/i.test(url.trim());
}

export default function MusicaAdmin() {
  const [lista, setLista] = useState<TrackConDuracion[]>([]);
  const [valores, setValores] = useState<Valores>(vacio);
  const [error, setError] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);

  useEffect(() => {
    setLista(obtenerPlaylist());
  }, []);

  function cambiar(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
    const { name, value } = e.target;
    setValores((prev) => ({ ...prev, [name]: value }));
    setError("");
  }

  function guardar(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    if (!valores.nombre.trim() || !valores.artista.trim() || !valores.categoria) {
      setError("Completá título, intérprete y categoría.");
      return;
    }
    if (!valores.url.trim()) {
      setError("Pegá el link del archivo de audio.");
      return;
    }
    if (!esFormatoValido(valores.url)) {
      setError("El link debe terminar en .mp3 o .mp4.");
      return;
    }

    setCargando(true);
    const audio = new Audio();
    audio.src = valores.url.trim();

    audio.addEventListener("loadedmetadata", () => {
      const nueva: TrackConDuracion = {
        nombre: valores.nombre,
        artista: valores.artista,
        categoria: valores.categoria,
        url: valores.url.trim(),
        duracionSegundos: Math.round(audio.duration) || 0,
      };
      agregarCancion(nueva);
      setLista(obtenerPlaylist());
      setValores(vacio);
      setCargando(false);
    });

    audio.addEventListener("error", () => {
      setError("No se pudo leer el archivo desde ese link. Verificá que sea un link directo al audio.");
      setCargando(false);
    });
  }

  function eliminar(url: string): void {
    if (!esEditable(url)) return;
    eliminarCancion(url);
    setLista(obtenerPlaylist());
  }

  return (
    <div className="modulo">
      <h1 className="modulo-titulo">Biblioteca Musical</h1>

      <div className="modulo-tabla-wrap">
        <table className="modulo-tabla">
          <thead>
            <tr>
              <th>Título</th>
              <th>Artista</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr>
                <td colSpan={4} className="modulo-vacio">
                  No hay registros.
                </td>
              </tr>
            )}
            {lista.map((t) => (
              <tr key={t.url}>
                <td>{t.nombre}</td>
                <td>{t.artista}</td>
                <td>{t.categoria}</td>
                <td>
                  {esEditable(t.url) ? (
                    <button type="button" className="modulo-link" onClick={() => eliminar(t.url)}>
                      Eliminar
                    </button>
                  ) : (
                    <span style={{ opacity: 0.5 }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="modulo-subtitulo">Nueva Carga</h2>

      <form onSubmit={guardar} noValidate>
        <div className="modulo-caja">
          <div className="modulo-campos">
            <div className="modulo-campo">
              <label htmlFor="nombre">Título</label>
              <input id="nombre" name="nombre" type="text" value={valores.nombre} onChange={cambiar} />
            </div>
            <div className="modulo-campo">
              <label htmlFor="artista">Intérprete/Autor</label>
              <input id="artista" name="artista" type="text" value={valores.artista} onChange={cambiar} />
            </div>
            <div className="modulo-campo">
              <label htmlFor="categoria">Categoría</label>
              <select id="categoria" name="categoria" value={valores.categoria} onChange={cambiar}>
                <option value="">Seleccioná una opción</option>
                {categorias.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="modulo-campo">
              <label htmlFor="url">Link del archivo (.mp3 o .mp4)</label>
              <input
                id="url"
                name="url"
                type="text"
                value={valores.url}
                onChange={cambiar}
                placeholder="https://.../cancion.mp3"
              />
            </div>
          </div>
        </div>

        {error && <p className="modulo-error">{error}</p>}

        <div className="modulo-acciones">
          <button type="submit" className="modulo-guardar" disabled={cargando}>
            {cargando ? "Verificando archivo..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}