import { playlist as base, type TrackConDuracion } from "./playlist";
import { borrarArchivo } from "./archivosAudio";

// Todo lo que se cambia desde el panel se guarda en el navegador (localStorage):
// - canciones nuevas, cambios de datos, canciones ocultas y canciones borradas.
const CLAVE_EXTRA = "radio_playlist_extra";
const CLAVE_CAMBIOS = "radio_playlist_cambios";
const CLAVE_OCULTAS = "radio_playlist_ocultas";
const CLAVE_BORRADAS = "radio_playlist_borradas";

export interface DatosCancion {
  nombre: string;
  artista: string;
  categoria: string;
}

// Canción como la ve el panel: con su estado.
export interface CancionAdmin extends TrackConDuracion {
  oculta: boolean;
  cargadaEnPanel: boolean;
}

function leer<T>(clave: string, porDefecto: T): T {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado ? (JSON.parse(guardado) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}

function escribir(clave: string, valor: unknown): void {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// Todas las canciones del sistema, incluidas las ocultas (para el panel).
export function obtenerTodas(): CancionAdmin[] {
  const borradas = new Set(leer<string[]>(CLAVE_BORRADAS, []));
  const ocultas = new Set(leer<string[]>(CLAVE_OCULTAS, []));
  const cambios = leer<Record<string, DatosCancion>>(CLAVE_CAMBIOS, {});
  const extra = leer<TrackConDuracion[]>(CLAVE_EXTRA, []);

  const delSitio = base.filter((t) => !borradas.has(t.url)).map((t) => ({ ...t, cargadaEnPanel: false }));
  const delPanel = extra.map((t) => ({ ...t, cargadaEnPanel: true }));

  return [...delSitio, ...delPanel].map((t) => ({
    ...t,
    ...(cambios[t.url] ?? {}),
    oculta: ocultas.has(t.url),
  }));
}

// Lo que escucha la gente: todas menos las ocultas.
export function obtenerPlaylist(): TrackConDuracion[] {
  return obtenerTodas()
    .filter((t) => !t.oculta)
    .map((t) => ({
      nombre: t.nombre,
      artista: t.artista,
      categoria: t.categoria,
      url: t.url,
      duracionSegundos: t.duracionSegundos,
    }));
}

export function existeCancion(url: string): boolean {
  return obtenerTodas().some((t) => t.url === url);
}

export function agregarCancion(cancion: TrackConDuracion): void {
  const extra = leer<TrackConDuracion[]>(CLAVE_EXTRA, []);
  escribir(CLAVE_EXTRA, [...extra, cancion]);
}

export function editarCancion(url: string, datos: DatosCancion): void {
  const cambios = leer<Record<string, DatosCancion>>(CLAVE_CAMBIOS, {});
  cambios[url] = datos;
  escribir(CLAVE_CAMBIOS, cambios);
}

export function cambiarOculta(url: string, oculta: boolean): void {
  const ocultas = leer<string[]>(CLAVE_OCULTAS, []).filter((u) => u !== url);
  escribir(CLAVE_OCULTAS, oculta ? [...ocultas, url] : ocultas);
}

// Borra la canción del sistema: deja de sonar en todos lados.
export async function eliminarCancion(url: string): Promise<void> {
  const extra = leer<TrackConDuracion[]>(CLAVE_EXTRA, []);
  if (extra.some((t) => t.url === url)) {
    escribir(CLAVE_EXTRA, extra.filter((t) => t.url !== url));
    await borrarArchivo(url);
  } else {
    escribir(CLAVE_BORRADAS, [...leer<string[]>(CLAVE_BORRADAS, []), url]);
  }

  const cambios = leer<Record<string, DatosCancion>>(CLAVE_CAMBIOS, {});
  delete cambios[url];
  escribir(CLAVE_CAMBIOS, cambios);
  cambiarOculta(url, false);
}

// true si la canción se cargó desde el panel (la usa el Panel para contarlas).
export function esEditable(url: string): boolean {
  return leer<TrackConDuracion[]>(CLAVE_EXTRA, []).some((t) => t.url === url);
}