import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { usuarios, roles } from "../data/usuarios";
import type { UsuarioSesion, Seccion } from "../data/usuarios";

interface ResultadoLogin {
  ok: boolean;
  error?: string;
}

interface AuthContextValor {
  usuario: UsuarioSesion | null;
  cargando: boolean;
  login: (email: string, password: string) => ResultadoLogin;
  logout: () => void;
  tienePermiso: (seccion: Seccion) => boolean;
}

const AuthContext = createContext<AuthContextValor | null>(null);

const CLAVE_STORAGE = "radio_sesion";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  // Al arrancar la app, recuperamos la sesión guardada en el navegador.
  useEffect(() => {
    const guardado = localStorage.getItem(CLAVE_STORAGE);
    if (guardado) {
      try {
        setUsuario(JSON.parse(guardado) as UsuarioSesion);
      } catch {
        localStorage.removeItem(CLAVE_STORAGE);
      }
    }
    setCargando(false);
  }, []);

  function login(email: string, password: string): ResultadoLogin {
    const encontrado = usuarios.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );

    if (!encontrado) {
      return { ok: false, error: "Email o contraseña incorrectos." };
    }
    if (!encontrado.activo) {
      return { ok: false, error: "Esta cuenta está desactivada." };
    }

    // Armamos la sesión campo por campo para no arrastrar la contraseña.
    const sesion: UsuarioSesion = {
      id: encontrado.id,
      nombre: encontrado.nombre,
      email: encontrado.email,
      rol: encontrado.rol,
      activo: encontrado.activo,
    };

    setUsuario(sesion);
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(sesion));
    return { ok: true };
  }

  function logout(): void {
    setUsuario(null);
    localStorage.removeItem(CLAVE_STORAGE);
  }

  function tienePermiso(seccion: Seccion): boolean {
    if (!usuario) return false;
    return roles[usuario.rol].permisos.includes(seccion);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, cargando, login, logout, tienePermiso }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Atajo para no repetir useContext(AuthContext) en cada componente.
export function useAuth(): AuthContextValor {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}