import ModuloAdmin from "../../components/admin/ModuloAdmin";
import { categorias } from "../../data/categorias";

export default function ProduccionesAdmin() {
  return (
    <ModuloAdmin
      titulo="Producciones"
      columnas={[
        { clave: "titulo", titulo: "Título" },
        { clave: "autor", titulo: "Autor" },
        { clave: "categoria", titulo: "Categoría" },
      ]}
      campos={[
        { clave: "titulo", etiqueta: "Título" },
        { clave: "autor", etiqueta: "Intérprete/Autor" },
        {
          clave: "categoria",
          etiqueta: "Categoría",
          tipo: "select",
          opciones: categorias,
        },
        { clave: "link", etiqueta: "Link/URL" },
        { clave: "contenido", etiqueta: "Contenido", tipo: "area" },
      ]}
      textoArchivo="Arrastrá el archivo aquí o hacé click para seleccionar"
      inicial={[]}
    />
  );
}