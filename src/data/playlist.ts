export interface TrackConDuracion {
  nombre: string;
  artista: string;
  categoria: string;
  url: string;
  duracionSegundos: number;
}

export const playlist: TrackConDuracion[] = [
  {
    nombre: 'Eyes',
    artista: 'Patrick Jordan Patrikios',
    categoria: 'Electronica',
    url: '/public/ejemplo1.mp3',
    duracionSegundos: 310,
  },
  {
    nombre: 'Frutile',
    artista: 'The Grey Room',
    categoria: 'Pop',
    url: '/public/ejemplo2.mp3',
    duracionSegundos: 312,
  },
];