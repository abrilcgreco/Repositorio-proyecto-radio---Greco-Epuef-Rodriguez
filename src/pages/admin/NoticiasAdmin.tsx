import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Noticia } from "../../data/noticias";
import {
  obtenerNoticias,
  agregarNoticia,
  editarNoticia,
  eliminarNoticia,
  esEditable,
} from "../../data/noticiasStore";
import "../../components/admin/ModuloAdmin.css";

type Valores = {
  titulo: string;
  resumen: string;
  instagramUrl: string;
};

const vacio: Valores = { titulo: "", resumen: "", instagramUrl: "" };

export default function NoticiasAdmin() {
  const [lista, setLista] = useState<Noticia[]>([]);
  const [valores, setValores] = useState<Valores>(vacio);
  const [imagen, setImagen] = useState<string>("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setLista(obtenerNoticias());
  }, []);

  function limpiar(): void {
    setValores(vacio);
    setImagen("");
    setEditandoId(null);
    setError("");
  }

  function cambiar(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const { name, value } = e.target;
    setValores((prev) => ({ ...prev, [name]: value }));
    setError("");
  }

  function elegirImagen(e: ChangeEvent<HTMLInputElement>): void {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => setImagen(lector.result as string);
    lector.readAsDataURL(archivo);
  }

  function guardar(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    if (!valores.titulo.trim() || !valores.resumen.trim()) {
      setError("Completá título y descripción.");
      return;
    }

    const datos: Omit<Noticia, "id"> = {
      titulo: valores.titulo,
      resumen: valores.resumen,
      textoCompleto: valores.resumen,
      imagen: imagen || undefined,
      instagramUrl: valores.instagramUrl || undefined,
    };

    if (editandoId !== null) {
      editarNoticia(editandoId, datos);
    } else {
      agregarNoticia(datos);
    }

    setLista(obtenerNoticias());
    limpiar();
  }

  function editar(n: Noticia): void {
    if (!esEditable(n.id)) return;
    setValores({
      titulo: n.titulo,
      resumen: n.resumen,
      instagramUrl: n.instagramUrl ?? "",
    });
    setImagen(n.imagen ?? "");
    setEditandoId(n.id);
    setError("");
  }

  function eliminar(id: number): void {
    if (!esEditable(id)) return;
    eliminarNoticia(id);
    setLista(obtenerNoticias());
    if (editandoId === id) limpiar();
  }

  return (
    <div className="modulo">
      <h1 className="modulo-titulo">Noticias</h1>

      <div className="modulo-tabla-wrap">
        <table className="modulo-tabla">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr>
                <td colSpan={3} className="modulo-vacio">
                  No hay registros.
                </td>
              </tr>
            )}
            {lista.map((n) => (
              <tr key={n.id}>
                <td>{n.titulo}</td>
                <td>{n.resumen}</td>
                <td>
                  {esEditable(n.id) ? (
                    <>
                      <button type="button" className="modulo-link" onClick={() => editar(n)}>
                        Editar
                      </button>
                      {" / "}
                      <button type="button" className="modulo-link" onClick={() => eliminar(n.id)}>
                        Eliminar
                      </button>
                    </>
                  ) : (
                    <span style={{ opacity: 0.5 }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="modulo-subtitulo">
        {editandoId !== null ? "Editar noticia" : "Nueva Carga"}
      </h2>

      <form onSubmit={guardar} noValidate>
        <div className="modulo-caja">
          <div className="modulo-campos">
            <div className="modulo-campo">
              <label htmlFor="titulo">Título</label>
              <input id="titulo" name="titulo" type="text" value={valores.titulo} onChange={cambiar} />
            </div>
            <div className="modulo-campo">
              <label htmlFor="instagramUrl">Link de Instagram</label>
              <input
                id="instagramUrl"
                name="instagramUrl"
                type="text"
                value={valores.instagramUrl}
                onChange={cambiar}
                placeholder="https://www.instagram.com/p/..."
              />
            </div>
            <div className="modulo-campo">
              <label htmlFor="resumen">Descripción</label>
              <textarea id="resumen" name="resumen" value={valores.resumen} onChange={cambiar} rows={4} />
            </div>
          </div>

          <label
            className="modulo-drop"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const archivo = e.dataTransfer.files?.[0];
              if (!archivo) return;
              const lector = new FileReader();
              lector.onload = () => setImagen(lector.result as string);
              lector.readAsDataURL(archivo);
            }}
          >
            <input type="file" accept="image/*" onChange={elegirImagen} hidden />
            {imagen ? "Imagen cargada ✓" : "Arrastrá el archivo aquí o hacé click para seleccionar"}
          </label>
        </div>

        {error && <p className="modulo-error">{error}</p>}

        <div className="modulo-acciones">
          {editandoId !== null && (
            <button type="button" className="modulo-cancelar" onClick={limpiar}>
              Cancelar
            </button>
          )}
          <button type="submit" className="modulo-guardar">
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}