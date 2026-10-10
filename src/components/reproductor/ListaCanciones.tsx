import { useEffect } from 'react';
import { useReproductor, normalizar } from '../../context/ReproductorContext';
import './ListaCanciones.css';

interface ListaCancionesProps {
  abierta: boolean;
  onCerrar: () => void;
}

function formatearHora(ms: number): string {
  return new Date(ms).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

// Panel lateral con lo que suena, lo que viene y lo que ya pasó.
// Se abre a la derecha y corre la página para que se siga viendo todo.
export default function ListaCanciones({ abierta, onCerrar }: ListaCancionesProps) {
  const { currentTrack, genero, aleatorio, historial, proximas } = useReproductor();

  // Se cierra con Escape.
  useEffect(() => {
    if (!abierta) return;
    const cerrar = (e: KeyboardEvent) => e.key === 'Escape' && onCerrar();
    window.addEventListener('keydown', cerrar);
    return () => window.removeEventListener('keydown', cerrar);
  }, [abierta, onCerrar]);

  // Si cambiaste de género con la radio en pausa, la canción cargada es de otra emisora: no se muestra.
  const trackVisible =
    currentTrack && (!genero || normalizar(currentTrack.categoria) === normalizar(genero)) ? currentTrack : null;
  const esMix = genero === null;

  return (
    <aside
      className={`lista-panel ${abierta ? 'abierta' : ''}`}
      aria-label="Lista de canciones"
      aria-hidden={!abierta}
    >
      <div className="lista-encabezado">
        <div>
          <h4>Lista de canciones</h4>
          <p className="lista-ayuda">Mirá qué está sonando, qué viene y qué ya pasó.</p>
        </div>
        <button type="button" className="lista-cerrar" onClick={onCerrar} aria-label="Cerrar lista">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>

      <div className="lista-contenido">
        <p className="lista-seccion">Sonando ahora</p>
        {trackVisible ? (
          <div className="lista-item actual">
            <div>
              <p className="item-nombre">{trackVisible.nombre}</p>
              <p className="item-artista">{trackVisible.artista} · {trackVisible.categoria}</p>
            </div>
            <span className="item-hora">En vivo</span>
          </div>
        ) : (
          <p className="lista-vacia">Nada todavía. Tocá el botón naranja de play para empezar.</p>
        )}

        <p className="lista-seccion">Próximas canciones</p>
        {esMix ? (
          <p className="lista-vacia">En el mix de todas las canciones, la próxima canción es una sorpresa.</p>
        ) : aleatorio ? (
          <p className="lista-vacia">Con el modo aleatorio activado, la próxima canción es una sorpresa.</p>
        ) : proximas.length === 0 ? (
          <p className="lista-vacia">Por ahora no hay más canciones en esta categoría.</p>
        ) : (
          <ul>
            {proximas.map((t, i) => (
              <li key={`${t.url}-${i}`} className="lista-item">
                <div>
                  <p className="item-nombre">{t.nombre}</p>
                  <p className="item-artista">{t.artista} · {t.categoria}</p>
                </div>
                <span className="item-hora">{i === 0 ? 'Sigue' : 'Después'}</span>
              </li>
            ))}
          </ul>
        )}

        <p className="lista-seccion">Ya sonaron</p>
        {historial.length === 0 ? (
          <p className="lista-vacia">Esta es una lista de las canciones que ya pasaron, por si te gustó alguna.</p>
        ) : (
          <ul>
            {historial.map((h, i) => (
              <li key={`${h.track.url}-${h.hora}-${i}`} className="lista-item pasada">
                <div>
                  <p className="item-nombre">{h.track.nombre}</p>
                  <p className="item-artista">{h.track.artista} · {h.track.categoria}</p>
                </div>
                <span className="item-hora">{formatearHora(h.hora)}</span>
              </li>
            ))}
          </ul>
        )}

        <p className="lista-nota">Es radio en vivo: las canciones no se pueden elegir ni saltear.</p>
      </div>
    </aside>
  );
}