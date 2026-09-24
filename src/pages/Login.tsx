import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

interface FormularioLogin {
  email: string;
  password: string;
}

type ErroresLogin = Partial<Record<keyof FormularioLogin, string>>;

// Lo que guardamos en el state de la navegación al patear al login.
interface EstadoNavegacion {
  desde?: string;
}

export default function Login() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState<FormularioLogin>({
    email: "",
    password: "",
  });
  const [errores, setErrores] = useState<ErroresLogin>({});
  const [errorGeneral, setErrorGeneral] = useState<string>("");
  const [verPassword, setVerPassword] = useState<boolean>(false);

  // Si ya está logueado, no tiene sentido mostrarle el login.
  if (usuario) {
    return <Navigate to="/admin" replace />;
  }

  function manejarCambio(e: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
    setErrorGeneral("");
  }

  function validar(): ErroresLogin {
    const nuevos: ErroresLogin = {};

    if (!form.email.trim()) {
      nuevos.email = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nuevos.email = "Ingresá un email válido.";
    }

    if (!form.password) {
      nuevos.password = "La contraseña es obligatoria.";
    } else if (form.password.length < 6) {
      nuevos.password = "Debe tener al menos 6 caracteres.";
    }

    return nuevos;
  }

  function manejarEnvio(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    const nuevos = validar();
    if (Object.keys(nuevos).length > 0) {
      setErrores(nuevos);
      return;
    }

    const resultado = login(form.email, form.password);
    if (!resultado.ok) {
      setErrorGeneral(resultado.error ?? "No se pudo iniciar sesión.");
      return;
    }

    const estado = location.state as EstadoNavegacion | null;
    navigate(estado?.desde ?? "/admin", { replace: true });
  }

  return (
    <div className="login-pantalla">
      <div className="login-caja">
        <h1 className="login-titulo">Panel de administración</h1>
        <p className="login-subtitulo">Ingresá con tu cuenta</p>

        <form onSubmit={manejarEnvio} noValidate>
          <div className="login-campo">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={manejarCambio}
              className={errores.email ? "con-error" : ""}
              placeholder="admin@radio.com"
              autoComplete="username"
            />
            {errores.email && (
              <span className="login-error">{errores.email}</span>
            )}
          </div>

          <div className="login-campo">
            <label htmlFor="password">Contraseña</label>
            <div className="login-password">
              <input
                id="password"
                name="password"
                type={verPassword ? "text" : "password"}
                value={form.password}
                onChange={manejarCambio}
                className={errores.password ? "con-error" : ""}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-ver"
                onClick={() => setVerPassword((v) => !v)}
              >
                {verPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
            {errores.password && (
              <span className="login-error">{errores.password}</span>
            )}
          </div>

          {errorGeneral && <div className="login-alerta">{errorGeneral}</div>}

          <button type="submit" className="login-boton">
            Ingresar
          </button>
        </form>

        <div className="login-ayuda">
          <strong>Usuarios de prueba</strong>
          <span>admin@radio.com / admin123</span>
          <span>editor@radio.com / editor123</span>
          <span>locutor@radio.com / locutor123</span>
        </div>
      </div>
    </div>
  );
}