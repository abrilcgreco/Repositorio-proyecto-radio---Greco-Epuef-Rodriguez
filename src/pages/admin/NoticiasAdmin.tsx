import ModuloAdmin from "../../components/admin/ModuloAdmin";

export default function NoticiasAdmin() {
  return (
    <ModuloAdmin
      titulo="Noticias"
      columnas={[
        { clave: "titulo", titulo: "Título" },
        { clave: "contenido", titulo: "Contenido" },
      ]}
      campos={[
        { clave: "titulo", etiqueta: "Título" },
        { clave: "autor", etiqueta: "Autor" },
        { clave: "link", etiqueta: "Link/URL" },
        { clave: "contenido", etiqueta: "Contenido", tipo: "area" },
      ]}
      textoArchivo="Arrastrá el archivo aquí o hacé click para seleccionar"
      inicial={[]}
    />
  );
}