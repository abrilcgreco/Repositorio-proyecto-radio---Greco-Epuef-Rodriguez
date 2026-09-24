import ModuloAdmin from "../../components/admin/ModuloAdmin";

export default function UsuariosAdmin() {
  return (
    <ModuloAdmin
      titulo="Usuarios y roles"
      columnas={[{ clave: "correo", titulo: "Correo electrónico" }]}
      campos={[
        { clave: "correo", etiqueta: "Correo electrónico" },
        { clave: "acceso", etiqueta: "Acceso" },
      ]}
      textoBoton="Autorizar"
      botonAncho
      estadoNuevo="Autorizada"
      inicial={[]}
    />
  );
}