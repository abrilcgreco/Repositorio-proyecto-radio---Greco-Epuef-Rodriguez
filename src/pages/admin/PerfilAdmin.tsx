import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { usePerfil, prepararFoto } from "./perfil";

const MAX_MB = 5;

export default function PerfilAdmin() {
  const { perfil, guardarPerfil } = usePerfil();

  const [nombreVisible, setNombreVisible] = useState<string>(perfil.nombreVisible);
  const [cargo, setCargo] = useState<string>(perfil.cargo);
  const [foto, setFoto] = useState<string>(perfil.foto);
  const [error, setError] = useState<string>("");
  const [aviso, setAviso] = useState<string>("");

  // El mensaje de "se guardó" se va solo a los pocos segundos.
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(""), 4000);
    return () => clearTimeout(t);
  }, [aviso]);

  async function elegirFoto(e: ChangeEvent<HTMLInputElement>): Promise<void> {
    const archivo = e.target.files?.[0];
    e.target.value = ""; // permite volver a elegir la misma foto
    if (!archivo) return;
    if (!archivo.type.startsWith("image/")) {
      setError("Elegí un archivo de imagen (JPG o PNG).");
      return;
    }
    if (archivo.size > MAX_MB * 1024 * 1024) {
      setError(`La imagen pesa más de ${MAX_MB} MB. Probá con una más chica.`);
      return;
    }
    try {
      setFoto(await prepararFoto(archivo));
      setError("");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function guardar(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (!nombreVisible.trim()) {
      setError("El nombre no puede quedar vacío.");
      return;
    }
    guardarPerfil({ nombreVisible: nombreVisible.trim(), cargo: cargo.trim(), foto });
    setError("");
    setAviso("Los cambios de tu perfil se guardaron.");
  }

  const inicial = nombreVisible.trim().charAt(0).toUpperCase() || "?";
  const hayCambios =
    nombreVisible !== perfil.nombreVisible || cargo !== perfil.cargo || foto !== perfil.foto;

  return (
    <div className="admin-pagina admin-pagina--angosta">
      <div className="admin-pagina-encabezado">
        <div>
          <h1 className="admin-titulo">Mi perfil</h1>
          <p className="admin-subtitulo">Así te ven en el panel de la radio.</p>
        </div>
      </div>

      {aviso && (
        <div className="admin-aviso admin-aviso--ok">
          <p>{aviso}</p>
        </div>
      )}

      <form onSubmit={guardar} noValidate className="admin-tarjeta">
        <div className="admin-tarjeta-encabezado">
          <h2>Foto de perfil</h2>
          <p>Se recorta en forma cuadrada. JPG o PNG de hasta {MAX_MB} MB.</p>
        </div>

        <div className="admin-perfil-foto">
          {foto ? (
            <img src={foto} alt="Tu foto de perfil" className="admin-avatar admin-avatar--grande" />
          ) : (
            <span className="admin-avatar admin-avatar--grande" aria-hidden="true">{inicial}</span>
          )}

          <div className="admin-perfil-botones">
            <label className="admin-boton admin-boton--secundario">
              <input type="file" accept="image/*" onChange={elegirFoto} hidden />
              {foto ? "Cambiar foto" : "Subir foto"}
            </label>
            {foto && (
              <button type="button" className="admin-boton-texto" onClick={() => setFoto("")}>
                Quitar foto
              </button>
            )}
          </div>
        </div>

        <div className="admin-tarjeta-encabezado admin-tarjeta-encabezado--medio">
          <h2>Datos</h2>
          <p>El nombre y el cargo aparecen abajo del menú lateral.</p>
        </div>

        <div className="admin-form">
          <div className="admin-campos">
            <div className="admin-campo">
              <label htmlFor="nombreVisible">Nombre para mostrar</label>
              <input
                id="nombreVisible"
                type="text"
                maxLength={40}
                value={nombreVisible}
                onChange={(e) => {
                  setNombreVisible(e.target.value);
                  setError("");
                }}
                placeholder="Ej: Abril Greco"
              />
            </div>
            <div className="admin-campo">
              <label htmlFor="cargo">Cargo o función</label>
              <input
                id="cargo"
                type="text"
                maxLength={50}
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Ej: Locución · Taller de Multimedios"
              />
            </div>
          </div>

          {error && <p className="admin-error">{error}</p>}

          <div className="admin-acciones">
            <button type="submit" className="admin-boton" disabled={!hayCambios}>
              Guardar cambios
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}