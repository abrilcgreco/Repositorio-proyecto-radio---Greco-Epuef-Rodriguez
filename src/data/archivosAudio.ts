// Archivos de audio subidos desde el panel.
// Se guardan en IndexedDB, la base de datos del navegador (localStorage es muy chico para música).
// En la playlist, una canción subida tiene una url del tipo "archivo:<id>".

const BASE = "radio_audio";
const TABLA = "archivos";
export const PREFIJO_ARCHIVO = "archivo:";

// Url reproducible (blob:...) de cada archivo ya cargado en memoria.
const urls = new Map<string, string>();
let precarga: Promise<void> | null = null;

function abrir(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const pedido = indexedDB.open(BASE, 1);
    pedido.onupgradeneeded = () => pedido.result.createObjectStore(TABLA);
    pedido.onsuccess = () => resolve(pedido.result);
    pedido.onerror = () => reject(pedido.error);
  });
}

function idDe(url: string): string {
  return url.slice(PREFIJO_ARCHIVO.length);
}

export function esArchivoLocal(url: string): boolean {
  return url.startsWith(PREFIJO_ARCHIVO);
}

export function nuevoId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function guardarArchivo(id: string, archivo: Blob): Promise<void> {
  const db = await abrir();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(TABLA, "readwrite");
    tx.objectStore(TABLA).put(archivo, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
  db.close();
  urls.set(id, URL.createObjectURL(archivo));
}

export async function borrarArchivo(url: string): Promise<void> {
  if (!esArchivoLocal(url)) return;
  const id = idDe(url);
  const db = await abrir();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(TABLA, "readwrite");
    tx.objectStore(TABLA).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  const blobUrl = urls.get(id);
  if (blobUrl) URL.revokeObjectURL(blobUrl);
  urls.delete(id);
}

// Carga todos los archivos guardados para que el reproductor los tenga listos.
export function precargarArchivos(): Promise<void> {
  if (!precarga) {
    precarga = abrir()
      .then(
        (db) =>
          new Promise<void>((resolve) => {
            const tx = db.transaction(TABLA, "readonly");
            const pedido = tx.objectStore(TABLA).openCursor();
            pedido.onsuccess = () => {
              const cursor = pedido.result;
              if (!cursor) {
                db.close();
                resolve();
                return;
              }
              const id = String(cursor.key);
              if (!urls.has(id)) urls.set(id, URL.createObjectURL(cursor.value as Blob));
              cursor.continue();
            };
            pedido.onerror = () => resolve();
          })
      )
      .catch(() => undefined);
  }
  return precarga;
}

// Devuelve la url que entiende el <audio>. Para canciones con link, es el mismo link.
export function resolverUrl(url: string): string {
  if (!esArchivoLocal(url)) return url;
  return urls.get(idDe(url)) ?? "";
}

export function estaListo(url: string): boolean {
  return !esArchivoLocal(url) || urls.has(idDe(url));
}