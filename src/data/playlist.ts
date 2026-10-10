export interface TrackConDuracion {
  nombre: string;
  artista: string;
  categoria: string;
  url: string;
  duracionSegundos: number;
}

// Los archivos de la carpeta public/ se usan desde la raíz: "/ejemplo1.mp3", sin "/public".
export const playlist: TrackConDuracion[] = [
  {
    nombre: 'Eyes',
    artista: 'Patrick Jordan Patrikios',
    categoria: 'Electrónica',
    url: '/ejemplo1.mp3',
    duracionSegundos: 310,
  },
  {
    nombre: 'Frutile',
    artista: 'The Grey Room',
    categoria: 'Pop',
    url: '/ejemplo2.mp3',
    duracionSegundos: 312,
  },
];