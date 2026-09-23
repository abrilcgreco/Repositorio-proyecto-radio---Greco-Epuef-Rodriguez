import { useEffect } from 'react';
import Footer from '../components/layout/Footer';
import Reproductor from '../components/reproductor/Reproductor';
import { useReproductor } from '../context/ReproductorContext';

export default function Home() {
  const { setTrack } = useReproductor();

  useEffect(() => {
    setTrack({
      nombre: 'Canción de prueba',
      artista: 'Artista de prueba',
      categoria: 'Música',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    });
  }, []); // Se ejecuta solo una vez cuando el componente se carga

  return (
    <div>
      <h1>Bienvenido a la página de inicio</h1>
      <p>Esta es la página principal de la aplicación.</p>
      <Reproductor />
      <Footer />
    </div>
  );
}