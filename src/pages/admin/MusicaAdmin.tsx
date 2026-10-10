import { useState, useEffect } from "react";
import type { ChangeEvent, DragEvent, FormEvent } from "react";
import { categorias } from "../../data/categorias";
import {
  obtenerTodas,
  agregarCancion,
  editarCancion,
  cambiarOculta,
  eliminarCancion,
  existeCancion,
  type CancionAdmin,
} from "../../data/playlistStore";
import { guardarArchivo, nuevoId, PREFIJO_ARCHIVO } from "../../data/archivosAudio";
import "./MusicaAdmin.css";

type Valores = {
  nombre: string;
  artista: string;
  categoria: string;
  url: string;
};

type Origen = "archivo" | "link";

const vacio: Valores = { nombre: "", artista: "", categoria: "", url: "" };
const MAX_MB = 30;

function esLinkValido(url: string): boolean {
  return /^https?:\/\/.+\.(mp3|mp4|m4a|wav|ogg)(\?.*)?$/i.test(url.trim()) || /^\/.+\.(mp3|mp4|m4a|wav|ogg)(\?.*)?$/i.test(url.trim());
}

function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function formatearTiempo(segundos: number): string {
  const m = Math.floor(segundos / 60);
  const s = Math.floor(segundos % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatearPeso(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// "Los Abuelos - Mil horas.mp3" → "Los Abuelos - Mil horas"
function tituloDesdeArchivo(nombre: string): string {
  return nombre.replace(/\.[^.]+$/, "").replace(/[_]+/g, " ").trim();
}

// Lee cuánto dura un audio (archivo o link).
function leerDuracion(src: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.addEventListener("loadedmetadata", () => resolve(Math.round(audio.duration) || 0));
    audio.addEventListener("error", () => reject(new Error("No se pudo leer el audio.")));
    audio.src = src;
  });
}

function IconoEditar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.830 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );
}

function IconoOjo({ tachado }: { tachado: boolean }) {
  return tachado ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.8 11.8 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.550 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  );
}

function IconoBorrar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
    </svg>
  );
}

function IconoSubir() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
    </svg>
  );
}

export default function MusicaAdmin() {
  const [lista, setLista] = useState<CancionAdmin[]>([]);
  const [busqueda, setBusqueda] = useState<string>("");
  const [filtro, setFiltro] = useState<string>("");
  const [formAbierto, setFormAbierto] = useState<boolean>(false);
  const [editandoUrl, setEditandoUrl] = useState<string | null>(null);
  const [valores, setValores] = useState<Valores>(vacio);
  const [origen, setOrigen] = useState<Origen>("archivo");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [arrastrando, setArrastrando] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [aviso, setAviso] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);

  function recargar(): void {
    setLista(obtenerTodas());
  }

  useEffect(() => {
    recargar();
  }, []);

  // El mensaje de aviso se va solo a los pocos segundos.
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(""), 4000);
    return () => clearTimeout(t);
  }, [aviso]);

  function cambiar(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
    const { name, value } = e.target;
    setValores((prev) => ({ ...prev, [name]: value }));
    setError("");
  }

  function abrirNueva(): void {
    setEditandoUrl(null);
    setValores(vacio);
    setOrigen("archivo");
    setArchivo(null);
    setError("");
    setFormAbierto(true);
  }

  function abrirEdicion(t: CancionAdmin): void {
    setEditandoUrl(t.url);
    setValores({ nombre: t.nombre, artista: t.artista, categoria: t.categoria, url: t.url });
    setArchivo(null);
    setError("");
    setFormAbierto(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cerrarFormulario(): void {
    setFormAbierto(false);
    setEditandoUrl(null);
    setValores(vacio);
    setArchivo(null);
    setError("");
  }

  function elegirArchivo(nuevo: File | undefined): void {
    if (!nuevo) return;
    const esAudio = nuevo.type.startsWith("audio/") || /\.(mp3|mp4|m4a|wav|ogg)$/i.test(nuevo.name);
    if (!esAudio) {
      setError("Ese archivo no es de audio. Elegí un .mp3, .m4a, .wav u .ogg.");
      return;
    }
    if (nuevo.size > MAX_MB * 1024 * 1024) {
      setError(`El archivo pesa ${formatearPeso(nuevo.size)}. El máximo es ${MAX_MB} MB.`);
      return;
    }
    setArchivo(nuevo);
    setError("");
    // Si el título está vacío, se completa con el nombre del archivo.
    setValores((prev) => (prev.nombre.trim() ? prev : { ...prev, nombre: tituloDesdeArchivo(nuevo.name) }));
  }

  function soltar(e: DragEvent<HTMLLabelElement>): void {
    e.preventDefault();
    setArrastrando(false);
    elegirArchivo(e.dataTransfer.files?.[0]);
  }

  async function guardar(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    const datos = {
      nombre: valores.nombre.trim(),
      artista: valores.artista.trim(),
      categoria: valores.categoria,
    };

    if (!datos.nombre || !datos.artista || !datos.categoria) {
      setError("Completá título, intérprete y género.");
      return;
    }

    // Editar: solo cambian los datos, el audio sigue siendo el mismo.
    if (editandoUrl) {
      editarCancion(editandoUrl, datos);
      recargar();
      setAviso(`Se guardaron los cambios de "${datos.nombre}".`);
      cerrarFormulario();
      return;
    }

    if (origen === "archivo" && !archivo) {
      setError("Elegí el archivo de audio que querés subir.");
      return;
    }
    if (origen === "link") {
      if (!valores.url.trim()) {
        setError("Pegá el link del archivo de audio.");
        return;
      }
      if (!esLinkValido(valores.url)) {
        setError("El link tiene que ser directo al audio y terminar en .mp3, .mp4, .m4a, .wav u .ogg.");
        return;
      }
      if (existeCancion(valores.url.trim())) {
        setError("Esa canción ya está en la biblioteca.");
        return;
      }
    }

    setCargando(true);
    try {
      if (origen === "archivo" && archivo) {
        const temporal = URL.createObjectURL(archivo);
        const duracion = await leerDuracion(temporal).finally(() => URL.revokeObjectURL(temporal));
        const id = nuevoId();
        await guardarArchivo(id, archivo);
        agregarCancion({ ...datos, url: PREFIJO_ARCHIVO + id, duracionSegundos: duracion });
      } else {
        const url = valores.url.trim();
        const duracion = await leerDuracion(url);
        agregarCancion({ ...datos, url, duracionSegundos: duracion });
      }
      recargar();
      setAviso(`Se agregó "${datos.nombre}" a ${datos.categoria}.`);
      cerrarFormulario();
    } catch {
      setError(
        origen === "archivo"
          ? "No se pudo guardar el archivo. Probá con otro o revisá que no esté dañado."
          : "No se pudo leer el audio desde ese link. Verificá que sea un link directo al archivo."
      );
    } finally {
      setCargando(false);
    }
  }

  function alternarOculta(t: CancionAdmin): void {
    cambiarOculta(t.url, !t.oculta);
    recargar();
    setAviso(
      t.oculta
        ? `"${t.nombre}" vuelve a sonar en la radio.`
        : `"${t.nombre}" quedó oculta: no suena en la radio, pero sigue en la biblioteca.`
    );
  }

  async function eliminar(t: CancionAdmin): Promise<void> {
    const seguro = window.confirm(
      `¿Eliminar "${t.nombre}"?\n\nSe borra del sistema y no se va a escuchar en ningún lado. Esto no se puede deshacer.\n\nSi solo querés sacarla de la radio por un tiempo, usá "Ocultar".`
    );
    if (!seguro) return;
    await eliminarCancion(t.url);
    if (editandoUrl === t.url) cerrarFormulario();
    recargar();
    setAviso(`Se eliminó "${t.nombre}".`);
  }

  const texto = normalizar(busqueda);
  const filtradas = lista.filter((t) => {
    const coincideGenero = !filtro || normalizar(t.categoria) === normalizar(filtro);
    const coincideTexto =
      !texto || normalizar(t.nombre).includes(texto) || normalizar(t.artista).includes(texto);
    return coincideGenero && coincideTexto;
  });

  const cantidadOcultas = lista.filter((t) => t.oculta).length;

  return (
    <div className="admin-pagina">
      <div className="admin-pagina-encabezado">
        <div>
          <h1 className="admin-titulo">Biblioteca musical</h1>
          <p className="admin-subtitulo">
            {lista.length} {lista.length === 1 ? "canción" : "canciones"} en el sistema
            {cantidadOcultas > 0 && ` · ${cantidadOcultas} ${cantidadOcultas === 1 ? "oculta" : "ocultas"}`}
          </p>
        </div>
        {!formAbierto && (
          <button type="button" className="admin-boton" onClick={abrirNueva}>
            + Agregar canción
          </button>
        )}
      </div>

      {aviso && (
        <div className="admin-aviso admin-aviso--ok">
          <p>{aviso}</p>
        </div>
      )}

      {formAbierto && (
        <section className="admin-tarjeta">
          <div className="admin-tarjeta-encabezado">
            <h2>{editandoUrl ? "Editar canción" : "Nueva canción"}</h2>
            <p>
              {editandoUrl
                ? "Cambiá los datos que se muestran en la radio. El audio sigue siendo el mismo."
                : "Subí el archivo desde tu compu o pegá un link directo. La duración se lee sola."}
            </p>
          </div>

          <form onSubmit={guardar} noValidate className="admin-form">
            {!editandoUrl && (
              <div className="musica-origen">
                <div className="musica-pestanas" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={origen === "archivo"}
                    className={origen === "archivo" ? "activa" : ""}
                    onClick={() => {
                      setOrigen("archivo");
                      setError("");
                    }}
                  >
                    Subir archivo
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={origen === "link"}
                    className={origen === "link" ? "activa" : ""}
                    onClick={() => {
                      setOrigen("link");
                      setError("");
                    }}
                  >
                    Pegar link
                  </button>
                </div>

                {origen === "archivo" ? (
                  <label
                    className={`musica-drop ${arrastrando ? "arrastrando" : ""} ${archivo ? "con-archivo" : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setArrastrando(true);
                    }}
                    onDragLeave={() => setArrastrando(false)}
                    onDrop={soltar}
                  >
                    <input
                      type="file"
                      accept="audio/*,.mp3,.m4a,.wav,.ogg"
                      hidden
                      onChange={(e) => {
                        elegirArchivo(e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                    <IconoSubir />
                    {archivo ? (
                      <>
                        <span className="musica-drop-titulo">{archivo.name}</span>
                        <span className="musica-drop-detalle">{formatearPeso(archivo.size)} · Tocá para cambiarlo</span>
                      </>
                    ) : (
                      <>
                        <span className="musica-drop-titulo">Arrastrá el archivo acá o tocá para elegirlo</span>
                        <span className="musica-drop-detalle">MP3, M4A, WAV u OGG · hasta {MAX_MB} MB</span>
                      </>
                    )}
                  </label>
                ) : (
                  <div className="admin-campo">
                    <label htmlFor="url">Link directo al audio</label>
                    <input
                      id="url"
                      name="url"
                      type="text"
                      value={valores.url}
                      onChange={cambiar}
                      placeholder="https://.../cancion.mp3"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="admin-campos">
              <div className="admin-campo">
                <label htmlFor="nombre">Título</label>
                <input id="nombre" name="nombre" type="text" value={valores.nombre} onChange={cambiar} />
              </div>
              <div className="admin-campo">
                <label htmlFor="artista">Intérprete / autor</label>
                <input id="artista" name="artista" type="text" value={valores.artista} onChange={cambiar} />
              </div>
              <div className="admin-campo">
                <label htmlFor="categoria">Género</label>
                <select id="categoria" name="categoria" value={valores.categoria} onChange={cambiar}>
                  <option value="">Elegí un género</option>
                  {categorias.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p className="admin-error">{error}</p>}

            <div className="admin-acciones">
              <button type="button" className="admin-boton admin-boton--secundario" onClick={cerrarFormulario}>
                Cancelar
              </button>
              <button type="submit" className="admin-boton" disabled={cargando}>
                {cargando ? "Guardando..." : editandoUrl ? "Guardar cambios" : "Guardar canción"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="admin-tarjeta">
        <div className="admin-filtros">
          <input
            type="search"
            className="admin-buscador"
            placeholder="Buscar por título o artista"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar canción"
          />
          <select
            className="admin-select"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            aria-label="Filtrar por género"
          >
            <option value="">Todos los géneros</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="admin-tabla-wrap">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th className="admin-num">#</th>
                <th>Título</th>
                <th>Artista</th>
                <th>Género</th>
                <th className="admin-num">Duración</th>
                <th>Estado</th>
                <th className="admin-num">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-vacio">
                    {lista.length === 0
                      ? "Todavía no hay canciones cargadas."
                      : "No hay canciones que coincidan con la búsqueda."}
                  </td>
                </tr>
              )}
              {filtradas.map((t, i) => (
                <tr key={t.url} className={t.oculta ? "musica-fila--oculta" : ""}>
                  <td className="admin-num admin-apagado">{i + 1}</td>
                  <td className="admin-celda-fuerte">{t.nombre}</td>
                  <td>{t.artista}</td>
                  <td>
                    <span className="admin-genero">{t.categoria}</span>
                  </td>
                  <td className="admin-num">{formatearTiempo(t.duracionSegundos)}</td>
                  <td>
                    {t.oculta ? (
                      <span className="musica-estado musica-estado--oculta">Oculta</span>
                    ) : (
                      <span className="musica-estado musica-estado--visible">En la radio</span>
                    )}
                  </td>
                  <td className="admin-num">
                    <div className="musica-acciones">
                      <button
                        type="button"
                        className="musica-accion"
                        onClick={() => abrirEdicion(t)}
                        title="Editar datos"
                        aria-label={`Editar ${t.nombre}`}
                      >
                        <IconoEditar />
                      </button>
                      <button
                        type="button"
                        className={`musica-accion ${t.oculta ? "activa" : ""}`}
                        onClick={() => alternarOculta(t)}
                        title={t.oculta ? "Mostrar en la radio" : "Ocultar de la radio"}
                        aria-label={t.oculta ? `Mostrar ${t.nombre} en la radio` : `Ocultar ${t.nombre} de la radio`}
                        aria-pressed={t.oculta}
                      >
                        <IconoOjo tachado={t.oculta} />
                      </button>
                      <button
                        type="button"
                        className="musica-accion musica-accion--peligro"
                        onClick={() => eliminar(t)}
                        title="Eliminar del sistema"
                        aria-label={`Eliminar ${t.nombre}`}
                      >
                        <IconoBorrar />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}