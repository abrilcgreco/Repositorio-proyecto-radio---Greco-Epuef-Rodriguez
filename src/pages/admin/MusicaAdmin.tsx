import ModuloAdmin from "../../components/admin/ModuloAdmin";
import { categorias } from "../../data/categorias";

export default function MusicaAdmin() {
  return (
    <ModuloAdmin
      titulo="Biblioteca Musical"
      columnas={[
        { clave: "titulo", titulo: "Título" },
        { clave: "artista", titulo: "Artista" },
        { clave: "categoria", titulo: "Categoría" },
      ]}
      campos={[
        { clave: "titulo", etiqueta: "Título" },
        { clave: "artista", etiqueta: "Intérprete/Autor" },
        {
          clave: "categoria",
          etiqueta: "Categoría",
          tipo: "select",
          opciones: categorias,
        },
      ]}
      textoArchivo="Arrastrá el archivo de audio aquí o hacé click para seleccionar"
      inicial={[]}
    />
  );
}