import { useAuth } from "../../context/AuthContext";
import { roles } from "../../data/usuarios";

export default function AdminInicio() {
  const { usuario } = useAuth();

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Hola, {usuario?.nombre}</h1>
      <p style={{ color: "#a09cb5" }}>
        Ingresaste como{" "}
        <strong>{usuario ? roles[usuario.rol].etiqueta : ""}</strong>. Elegí una
        sección del menú para empezar.
      </p>
    </div>
  );
}