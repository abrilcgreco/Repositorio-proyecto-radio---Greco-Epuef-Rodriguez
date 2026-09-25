import { noticias as noticiasBase } from "./noticias";
import type { Noticia } from "./noticias";

const CLAVE = "radio_noticias_extra";

function leerExtra(): Noticia[] {
  const guardadas = localStorage.getItem(CLAVE);
  return guardadas ? (JSON.parse(guardadas) as Noticia[]) : [];
}

function guardarExtra(lista: Noticia[]): void {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
}

export function obtenerNoticias(): Noticia[] {
  return [...noticiasBase, ...leerExtra()];
}

export function agregarNoticia(n: Omit<Noticia, "id">): void {
  const extra = leerExtra();
  extra.push({ ...n, id: Date.now() });
  guardarExtra(extra);
}

export function editarNoticia(id: number, n: Omit<Noticia, "id">): void {
  const extra = leerExtra();
  const idx = extra.findIndex((x) => x.id === id);
  if (idx !== -1) {
    extra[idx] = { ...n, id };
    guardarExtra(extra);
  }
}

export function eliminarNoticia(id: number): void {
  guardarExtra(leerExtra().filter((n) => n.id !== id));
}

export function esEditable(id: number): boolean {
  return leerExtra().some((n) => n.id === id);
}