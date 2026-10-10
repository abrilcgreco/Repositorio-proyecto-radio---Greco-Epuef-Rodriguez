export interface TrackConDuracion {
  nombre: string;
  artista: string;
  categoria: string;
  url: string;
  duracionSegundos: number;
}

// Los archivos de la carpeta public/ se usan desde la raíz: "/ejemplo1.mp3", sin "/public".
// Las "Prueba ..." son canciones de ejemplo para que cada género tenga algo que sonar.
// Se pueden ocultar o eliminar desde la Biblioteca musical del panel.
export const playlist: TrackConDuracion[] = [
  { nombre: 'Eyes', artista: 'Patrick Jordan Patrikios', categoria: 'Electrónica', url: '/ejemplo1.mp3', duracionSegundos: 310 },
  { nombre: 'Frutile', artista: 'The Grey Room', categoria: 'Top 50 Argentina', url: '/ejemplo2.mp3', duracionSegundos: 312 },
  { nombre: 'Prueba Rock nacional', artista: 'Taller 724', categoria: 'Rock nacional', url: '/ejemplo1.mp3?rocknacional', duracionSegundos: 310 },
  { nombre: 'Prueba Rock internacional', artista: 'Taller 724', categoria: 'Rock internacional', url: '/ejemplo2.mp3?rockinternacional', duracionSegundos: 312 },
  { nombre: 'Prueba Cumbia', artista: 'Taller 724', categoria: 'Cumbia', url: '/ejemplo1.mp3?cumbia', duracionSegundos: 310 },
  { nombre: 'Prueba Cuarteto', artista: 'Taller 724', categoria: 'Cuarteto', url: '/ejemplo2.mp3?cuarteto', duracionSegundos: 312 },
  { nombre: 'Prueba RKT', artista: 'Taller 724', categoria: 'RKT', url: '/ejemplo1.mp3?rkt', duracionSegundos: 310 },
  { nombre: 'Prueba Reguetón', artista: 'Taller 724', categoria: 'Reguetón', url: '/ejemplo2.mp3?regueton', duracionSegundos: 312 },
  { nombre: 'Prueba 80, 90 y 2000', artista: 'Taller 724', categoria: '80, 90 y 2000', url: '/ejemplo1.mp3?ochentas', duracionSegundos: 310 },
  { nombre: 'Prueba Chacarera', artista: 'Taller 724', categoria: 'Chacarera', url: '/ejemplo2.mp3?chacarera', duracionSegundos: 312 },
];