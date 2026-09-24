import { useState } from "react";
import type { ChangeEvent, DragEvent, FormEvent } from "react";
import "./ModuloAdmin.css";

export type Estado = "Autorizada" | "Pendiente";

export interface Fila {
  id: number;
  estado: Estado;
  [clave: string]: string | number;
}

export interface Columna {
  clave: string;
  titulo: string;
}

export interface Campo {
  clave: string;
  etiqueta: string;
  tipo?: "texto" | "area" | "select";
  opciones?: string[];
}

interface ModuloAdminProps {
  titulo: string;
  columnas: Columna[];
  campos: Campo[];
  textoArchivo?: string;
  inicial: Fila[];
  textoBoton?: string;
  botonAncho?: boolean;
  estadoNuevo?: Estado;
}

type Valores = Record<string, string>;

export default function ModuloAdmin({
  titulo,
  columnas,
  campos,
  textoArchivo,
  inicial,
  textoBoton = "Guardar cambios",
  botonAncho = false,
  estadoNuevo = "Pendiente",
}: ModuloAdminProps) {
  const vacio: Valores = Object.fromEntries(campos.map((c) => [c.clave, ""]));

  const [filas, setFilas] = useState<Fila[]>(inicial);
  const [valores, setValores] = useState<Valores>(vacio);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [archivo, setArchivo] = useState<string>("");
  const [error, setError] = useState<string>("");

  function limpiarFormulario(): void {
    setValores(vacio);
    setEditandoId(null);
    setArchivo("");
    setError("");
  }

  function cambiar(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void {
    const { name, value } = e.target;
    setValores((prev) => ({ ...prev, [name]: value }));
    setError("");
  }

  function elegirArchivo(e: ChangeEvent<HTMLInputElement>): void {
    setArchivo(e.target.files?.[0]?.name ?? "");
  }

  function soltarArchivo(e: DragEvent<HTMLLabelElement>): void {
    e.preventDefault();
    setArchivo(e.dataTransfer.files[0]?.name ?? "");
  }

  function guardar(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    if (campos.some((c) => !valores[c.clave].trim())) {
      setError("Completá todos los campos.");
      return;
    }

    if (editandoId !== null) {
      setFilas((prev) =>
        prev.map((f) =>
          f.id === editandoId
            ? ({ ...valores, id: f.id, estado: f.estado } as Fila)
            : f
        )
      );
    } else {
      const nueva = { ...valores, id: Date.now(), estado: estadoNuevo } as Fila;
      setFilas((prev) => [...prev, nueva]);
    }

    limpiarFormulario();
  }

  function editar(fila: Fila): void {
    const nuevos: Valores = {};
    campos.forEach((c) => {
      nuevos[c.clave] = String(fila[c.clave] ?? "");
    });
    setValores(nuevos);
    setEditandoId(fila.id);
    setError("");
  }

  function eliminar(id: number): void {
    setFilas((prev) => prev.filter((f) => f.id !== id));
    if (editandoId === id) limpiarFormulario();
  }

  function dibujarCampo(c: Campo) {
    if (c.tipo === "area") {
      return (
        <textarea
          id={c.clave}
          name={c.clave}
          value={valores[c.clave]}
          onChange={cambiar}
          rows={4}
        />
      );
    }

    if (c.tipo === "select") {
      return (
        <select
          id={c.clave}
          name={c.clave}
          value={valores[c.clave]}
          onChange={cambiar}
        >
          <option value="">Seleccioná una opción</option>
          {(c.opciones ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        id={c.clave}
        name={c.clave}
        type="text"
        value={valores[c.clave]}
        onChange={cambiar}
      />
    );
  }

  return (
    <div className="modulo">
      <h1 className="modulo-titulo">{titulo}</h1>

      <div className="modulo-tabla-wrap">
        <table className="modulo-tabla">
          <thead>
            <tr>
              {columnas.map((c) => (
                <th key={c.clave}>{c.titulo}</th>
              ))}
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 && (
              <tr>
                <td colSpan={columnas.length + 2} className="modulo-vacio">
                  No hay registros.
                </td>
              </tr>
            )}
            {filas.map((f) => (
              <tr key={f.id}>
                {columnas.map((c) => (
                  <td key={c.clave}>{f[c.clave]}</td>
                ))}
                <td>{f.estado}</td>
                <td>
                  <button
                    type="button"
                    className="modulo-link"
                    onClick={() => editar(f)}
                  >
                    Editar
                  </button>
                  {" / "}
                  <button
                    type="button"
                    className="modulo-link"
                    onClick={() => eliminar(f.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="modulo-subtitulo">
        {editandoId !== null ? "Editar registro" : "Nueva Carga"}
      </h2>

      <form onSubmit={guardar} noValidate>
        <div className="modulo-caja">
          <div className="modulo-campos">
            {campos.map((c) => (
              <div key={c.clave} className="modulo-campo">
                <label htmlFor={c.clave}>{c.etiqueta}</label>
                {dibujarCampo(c)}
              </div>
            ))}
          </div>

          {textoArchivo && (
            <label
              className="modulo-drop"
              onDragOver={(e) => e.preventDefault()}
              onDrop={soltarArchivo}
            >
              <input type="file" onChange={elegirArchivo} hidden />
              {archivo || textoArchivo}
            </label>
          )}
        </div>

        {error && <p className="modulo-error">{error}</p>}

        <div className="modulo-acciones">
          {editandoId !== null && (
            <button
              type="button"
              className="modulo-cancelar"
              onClick={limpiarFormulario}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="modulo-guardar"
            style={botonAncho ? { width: "100%" } : undefined}
          >
            {textoBoton}
          </button>
        </div>
      </form>
    </div>
  );
}