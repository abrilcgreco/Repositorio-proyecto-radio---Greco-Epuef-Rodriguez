import { playlist as playlistBase } from "./playlist";
import type { TrackConDuracion } from "./playlist";

const CLAVE = "radio_playlist_extra";

function leerExtra(): TrackConDuracion[] {
  const guardadas = localStorage.getItem(CLAVE);
  return guardadas ? (JSON.parse(guardadas) as TrackConDuracion[]) : [];
}

function guardarExtra(lista: TrackConDuracion[]): void {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
}

export function obtenerPlaylist(): TrackConDuracion[] {
  return [...playlistBase, ...leerExtra()];
}

export function agregarCancion(track: TrackConDuracion): void {
  const extra = leerExtra();
  extra.push(track);
  guardarExtra(extra);
}

export function eliminarCancion(url: string): void {
  guardarExtra(leerExtra().filter((t) => t.url !== url));
}

export function esEditable(url: string): boolean {
  return leerExtra().some((t) => t.url === url);
}