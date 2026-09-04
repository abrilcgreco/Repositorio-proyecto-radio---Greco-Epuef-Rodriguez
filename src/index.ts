export interface Genero {
    id: number;
    nombre: string;
}
export interface Cancion {
    id: number;
    titulo: string;
    artista: string;
    duracion: string;
    genero: Genero;
    estado: "Autorizado" | "Pendiente";
}
export interface Produccion {
    id: number;
    título: string;
    autor: string;
    fecha: string;
    estado: "Autorizado" | "Pendiente";
}
export interface Noticias {
    id: number;
    titulo: string;
    contenido: string;
    fecha: string;
    estado: "Autorizado" | "Pendiente";
}
export interface Usuario {
    id: number;
    nombre: string;
    correo: string;
    rol: "Autorizado" | "Pendiente";
}