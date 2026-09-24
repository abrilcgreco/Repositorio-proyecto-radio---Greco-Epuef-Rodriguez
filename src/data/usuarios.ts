export type Rol = "admin" | "editor" | "locutor";

export type Seccion = "musica" | "producciones" | "noticias" | "usuarios";

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
  activo: boolean;
}

// El usuario tal como vive en la sesión: igual pero sin la contraseña.
export type UsuarioSesion = Omit<Usuario, "password">;

export interface DefinicionRol {
  etiqueta: string;
  permisos: Seccion[];
}

// Usuarios de prueba (mock data).
// Sin backend, esta lista hace de "base de datos".
export const usuarios: Usuario[] = [
  {
    id: 1,
    nombre: "Abril Greco",
    email: "admin@radio.com",
    password: "admin123",
    rol: "admin",
    activo: true,
  },
  {
    id: 2,
    nombre: "Carla Editora",
    email: "editor@radio.com",
    password: "editor123",
    rol: "editor",
    activo: true,
  },
  {
    id: 3,
    nombre: "Juan Locutor",
    email: "locutor@radio.com",
    password: "locutor123",
    rol: "locutor",
    activo: true,
  },
];

// Definición de roles y qué secciones del panel puede ver cada uno.
export const roles: Record<Rol, DefinicionRol> = {
  admin: {
    etiqueta: "Administrador",
    permisos: ["musica", "producciones", "noticias", "usuarios"],
  },
  editor: {
    etiqueta: "Editor",
    permisos: ["musica", "noticias"],
  },
  locutor: {
    etiqueta: "Locutor",
    permisos: ["producciones"],
  },
};