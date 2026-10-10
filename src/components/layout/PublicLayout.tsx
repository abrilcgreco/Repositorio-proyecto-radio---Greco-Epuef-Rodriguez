import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Reproductor from '../reproductor/Reproductor';
import ListaCanciones from '../reproductor/ListaCanciones';
import { useReproductor } from '../../context/ReproductorContext';
import './PublicLayout.css';

// Barras de cada onda lateral.
const CANTIDAD = 18;

// Alturas en reposo (cuando no suena nada).
const ONDA_BASE = Array.from({ length: CANTIDAD }, (_, i) =>
  Math.round(14 + Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.21)) * 80)
);

export default function PublicLayout() {
  const { isPlaying, analyserRef } = useReproductor();
  const { pathname } = useLocation();
  // Las ondas solo van en el Inicio: en Categorías se mezclan con el carrusel.
  const mostrarOndas = pathname === '/';

  // Lista de canciones: cuando se abre, la página y el reproductor se corren a la izquierda.
  const [listaAbierta, setListaAbierta] = useState<boolean>(false);
  const toggleLista = useCallback(() => setListaAbierta((a) => !a), []);
  const cerrarLista = useCallback(() => setListaAbierta(false), []);

  // Cada barra se guarda acá para cambiarle la altura sin volver a dibujar toda la página.
  const barrasIzq = useRef<(HTMLSpanElement | null)[]>([]);
  const barrasDer = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!mostrarOndas) return;

    const aplicar = (i: number, alto: number) => {
      const izq = barrasIzq.current[i];
      const der = barrasDer.current[i];
      if (izq) izq.style.height = `${alto}%`;
      if (der) der.style.height = `${alto}%`;
    };

    if (!isPlaying) {
      // En pausa vuelven a la forma de reposo.
      ONDA_BASE.forEach((h, i) => aplicar(i, h));
      return;
    }

    let animacion = 0;
    const datos = new Uint8Array(64);

    function dibujar() {
      const analizador = analyserRef.current;
      if (analizador) {
        analizador.getByteFrequencyData(datos);
        // Se usan las frecuencias graves y medias, que son las que más se mueven.
        const usables = 40;
        for (let i = 0; i < CANTIDAD; i++) {
          const valor = datos[Math.floor((i / CANTIDAD) * usables)] / 255;
          aplicar(i, Math.min(100, Math.max(8, ONDA_BASE[i] * 0.25 + valor * 100)));
        }
      }
      animacion = requestAnimationFrame(dibujar);
    }

    dibujar();
    return () => cancelAnimationFrame(animacion);
  }, [isPlaying, analyserRef, mostrarOndas]);

  return (
    <div className={`publico ${isPlaying ? 'publico--sonando' : ''} ${listaAbierta ? 'publico--lista' : ''}`}>
      {/* Ondas de los costados: quedan en el margen, así no las tapan las categorías */}
      {mostrarOndas && (
        <>
          <div className="publico-onda publico-onda--izq" aria-hidden="true">
            {ONDA_BASE.map((h, i) => (
              <span key={i} ref={(el) => { barrasIzq.current[i] = el; }} style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="publico-onda publico-onda--der" aria-hidden="true">
            {ONDA_BASE.map((h, i) => (
              <span key={i} ref={(el) => { barrasDer.current[i] = el; }} style={{ height: `${h}%` }} />
            ))}
          </div>
        </>
      )}

      <Header />
      <div className="publico-contenido">
        <Outlet />
      </div>

      {/* El reproductor vive acá: es uno solo para Inicio y Categorías y no se corta al navegar. */}
      <Reproductor listaAbierta={listaAbierta} onToggleLista={toggleLista} />
      <ListaCanciones abierta={listaAbierta} onCerrar={cerrarLista} />
    </div>
  );
}