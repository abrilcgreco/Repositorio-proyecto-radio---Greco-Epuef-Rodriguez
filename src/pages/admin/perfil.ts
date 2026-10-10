import { useOutletContext } from "react-router-dom";

// Datos del perfil que cada usuario puede personalizar (se guardan en este navegador).
export interface Perfil {
  nombreVisible: string;
  cargo: string;
  foto: string; // imagen en base64 ("" si no tiene foto)
}

export interface ContextoPerfil {
  perfil: Perfil;
  guardarPerfil: (nuevo: Perfil) => void;
}

const PREFIJO = "radio_perfil_";

export function leerPerfil(clave: string, nombrePorDefecto: string): Perfil {
  const vacio: Perfil = { nombreVisible: nombrePorDefecto, cargo: "", foto: "" };
  try {
    const guardado = localStorage.getItem(PREFIJO + clave);
    return guardado ? { ...vacio, ...JSON.parse(guardado) } : vacio;
  } catch {
    return vacio;
  }
}

export function escribirPerfil(clave: string, perfil: Perfil): boolean {
  try {
    localStorage.setItem(PREFIJO + clave, JSON.stringify(perfil));
    return true;
  } catch {
    return false;
  }
}

// Achica la foto a 256x256 (recortada al centro) para que ocupe poco espacio.
export function prepararFoto(archivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onerror = () => reject(new Error("No se pudo leer la imagen."));
    lector.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("El archivo no es una imagen válida."));
      img.onload = () => {
        const lado = 256;
        const recorte = Math.min(img.width, img.height);
        const canvas = document.createElement("canvas");
        canvas.width = lado;
        canvas.height = lado;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("No se pudo procesar la imagen."));
        ctx.drawImage(img, (img.width - recorte) / 2, (img.height - recorte) / 2, recorte, recorte, 0, 0, lado, lado);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = lector.result as string;
    };
    lector.readAsDataURL(archivo);
  });
}

// Lo usan las pantallas del admin para leer y cambiar el perfil.
export function usePerfil(): ContextoPerfil {
  return useOutletContext<ContextoPerfil>();
}