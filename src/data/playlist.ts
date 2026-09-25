export interface TrackConDuracion {
  nombre: string;
  artista: string;
  categoria: string;
  url: string;
  duracionSegundos: number;
}

export const playlist: TrackConDuracion[] = [
  {
    nombre: 'Canción de prueba 1',
    artista: 'Artista 1',
    categoria: 'Prueba',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duracionSegundos: 180,
  },
  {
    nombre: 'Canción de prueba 2',
    artista: 'Artista 2',
    categoria: 'Prueba',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duracionSegundos: 210,
  },
];