export interface CancionCarrusel {
  id: number;
  nombre: string;
  artista: string;
  genero: string;
  portada?: string;
}

export interface ColorFondo {
  nombre: string;
  oscuro: string;
  claro: string;
  texto: string;
}

export const coloresEscuela: ColorFondo[] = [
  { nombre: "Naranja", oscuro: "#2b1911", claro: "#e05e21", texto: "#e0e0e0" },
  { nombre: "Azul", oscuro: "#101c2e", claro: "#1b64b8", texto: "#e0e0e0" },
  { nombre: "Rojo", oscuro: "#2b1212", claro: "#d92b2b", texto: "#e0e0e0" },
  { nombre: "Verde", oscuro: "#11261a", claro: "#2f9e4f", texto: "#e0e0e0" },
  { nombre: "Amarillo", oscuro: "#2b2510", claro: "#f0c419", texto: "#2b2510" },
];

// En "portada" va /Portadas/ + el nombre EXACTO del archivo, con su extensión.
export const canciones: CancionCarrusel[] = [
  { id: 1, nombre: "De Música Ligera", artista: "Soda Stereo", genero: "Rock", portada: "/Portadas/cancion1.jpg" },
  { id: 2, nombre: "A Sky Full of Stars", artista: "Coldplay", genero: "Pop", portada: "/Portadas/cancion2.jpg" },
  { id: 3, nombre: "Puente", artista: "Gustavo Cerati", genero: "Rock", portada: "/Portadas/cancion3.jpg" },
  { id: 4, nombre: "Persiana Americana", artista: "Soda Stereo", genero: "Rock", portada: "/Portadas/cancion4.jpg" },
  { id: 5, nombre: "Ojitos Lindos", artista: "Bad Bunny & Bomba Estéreo", genero: "Reggaetón", portada: "/Portadas/cancion5.jpg" },
  { id: 6, nombre: "Me Rehúso", artista: "Danny Ocean", genero: "Reggaetón", portada: "/Portadas/cancion6.jpg" },
  { id: 7, nombre: "Por Mil Noches", artista: "Airbag", genero: "Rock", portada: "/Portadas/cancion7.jpg" },
];