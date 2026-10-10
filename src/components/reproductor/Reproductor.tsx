import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useReproductor, normalizar } from '../../context/ReproductorContext';
import './Reproductor.css';

function formatearTiempo(segundos: number): string {
  if (!Number.isFinite(segundos) || segundos < 0) return '0:00';
  const m = Math.floor(segundos / 60);
  const s = Math.floor(segundos % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Frases que Illi, la mascota de la escuela, dice de vez en cuando.
const MENSAJES_ILLI = [
  '¡Hola! Soy Illi, la mascota de la 724.',
  'Sonamos desde Trelew, Chubut, para toda la comunidad.',
  'Elegí un género y te acompaño con música.',
  '¿Te gustó un tema? Tocá "Lista de canciones" y fijate cuál era.',
];

const DURACION_GLOBO = 5500; // cuánto tiempo se ve cada mensaje (ms)
const CADA_CUANTO = 45000; // cada cuánto Illi dice algo por su cuenta (ms)

function mensajeAlAzar(): string {
  return MENSAJES_ILLI[Math.floor(Math.random() * MENSAJES_ILLI.length)];
}

function IconoAleatorio() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
    </svg>
  );
}

function IconoLista() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 10h11v2H3zm0-4h11v2H3zm0 8h7v2H3zm13-1v8l6-4z" />
    </svg>
  );
}

interface ReproductorProps {
  listaAbierta: boolean;
  onToggleLista: () => void;
}

export default function Reproductor({ listaAbierta, onToggleLista }: ReproductorProps) {
  const {
    isPlaying,
    currentTrack,
    progress,
    duration,
    volume,
    setVolume,
    muted,
    toggleMute,
    aleatorio,
    toggleAleatorio,
    genero,
    listaVacia,
    togglePlay,
  } = useReproductor();

  // Globo de diálogo de Illi: aparece un rato y se va.
  const [globo, setGlobo] = useState<string | null>(null);
  const temporizador = useRef<number | undefined>(undefined);
  const primeraVez = useRef<boolean>(true);
  const ultimoCambioGenero = useRef<number>(0);

  function decir(mensaje: string) {
    setGlobo(mensaje);
    window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => setGlobo(null), DURACION_GLOBO);
  }

  // Para que el saludo sepa en qué página está (en el Inicio cuenta que suena el mix).
  const generoActual = useRef<string | null>(genero);
  generoActual.current = genero;

  // Saluda al entrar y después dice algo cada tanto.
  useEffect(() => {
    const saludo = window.setTimeout(() => {
      decir(
        generoActual.current === null
          ? '¡Hola! Soy Illi. Acá suena un mix de todas las canciones. Si querés un género, entrá a Categorías.'
          : MENSAJES_ILLI[0]
      );
    }, 1500);
    const intervalo = window.setInterval(() => decir(mensajeAlAzar()), CADA_CUANTO);
    return () => {
      window.clearTimeout(saludo);
      window.clearInterval(intervalo);
      window.clearTimeout(temporizador.current);
    };
  }, []);

  // Cuando cambiás de género, Illi avisa qué está sonando.
  useEffect(() => {
    if (primeraVez.current) {
      primeraVez.current = false;
      return;
    }
    ultimoCambioGenero.current = Date.now();
    decir(genero ? `¡Buena elección! Ahora suena ${genero}.` : '¡Volvimos al mix de todas las canciones!');
  }, [genero]);

  // Cuando empieza otra canción, Illi la presenta (salvo que recién haya hablado del género).
  const urlActual = currentTrack?.url;
  useEffect(() => {
    if (!urlActual || !currentTrack) return;
    if (Date.now() - ultimoCambioGenero.current < 1500) return;
    decir(`Ahora suena "${currentTrack.nombre}" de ${currentTrack.artista}.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlActual]);

  // Si cambiaste de género con la radio en pausa, la canción cargada es de otra emisora: no se muestra.
  const trackVisible =
    currentTrack && (!genero || normalizar(currentTrack.categoria) === normalizar(genero)) ? currentTrack : null;

  const porcentaje = trackVisible && duration > 0 ? Math.min(100, (progress / duration) * 100) : 0;
  const volumenVisible = muted ? 0 : volume;

  let nombre = trackVisible?.nombre ?? (genero ? `Tocá play para escuchar ${genero}` : 'Tocá play para escuchar');
  let artista = trackVisible?.artista ?? 'Radio en vivo';
  if (listaVacia) {
    nombre = genero ? `Todavía no hay canciones de ${genero}` : 'Todavía no hay canciones';
    artista = 'Probá con otra categoría';
  }

  // En el Inicio siempre es el mix; en Categorías el aleatorio es opcional.
  const esMix = genero === null;
  const etiquetaAleatorio = esMix ? 'Mix de todas las canciones' : `Aleatorio en ${genero}`;

  return (
    <div className="reproductor" role="region" aria-label="Reproductor de Radio 724">
      {/* Illi: si le hacés clic, te dice algo */}
      <button
        type="button"
        className="reproductor-mascota"
        onClick={() => decir(mensajeAlAzar())}
        aria-label="Hablar con Illi"
      >
        <img src="/robotillie.png" alt="Illi, la mascota de la escuela" />
      </button>
      {globo && (
        <p className="illi-globo" key={globo} aria-live="polite">{globo}</p>
      )}

      <div className="reproductor-cuerpo">
        <div className="reproductor-fila">
          <div className="reproductor-info">
            <div className="reproductor-titulo">
              <h3>Radio 724</h3>
              <span className={`reproductor-vivo ${isPlaying ? 'sonando' : ''}`}>
                <span className="reproductor-vivo-punto" aria-hidden="true" />
                En vivo
              </span>
            </div>
            <p>
              Escuchando: <strong>{genero ?? 'Mix de todas las canciones'}</strong>
            </p>
          </div>

          <div className="reproductor-track">
            <p className="reproductor-nombre">{nombre}</p>
            <p className="reproductor-artista">{artista}</p>
            {aleatorio || esMix ? (
              <p className="reproductor-categoria reproductor-categoria--mix">
                <IconoAleatorio />
                {etiquetaAleatorio}
              </p>
            ) : (
              <p className="reproductor-categoria">{trackVisible?.categoria ?? genero ?? 'En vivo'}</p>
            )}
          </div>
        </div>

        <div className="reproductor-controles">
          {/* El botón de aleatorio solo tiene sentido dentro de un género */}
          {!esMix && (
            <button
              type="button"
              className={`reproductor-boton reproductor-aleatorio ${aleatorio ? 'activo' : ''}`}
              onClick={toggleAleatorio}
              aria-pressed={aleatorio}
              aria-label={aleatorio ? 'Desactivar reproducción aleatoria' : 'Activar reproducción aleatoria'}
              title={aleatorio ? etiquetaAleatorio : 'Aleatorio'}
            >
              <IconoAleatorio />
            </button>
          )}

          <button
            type="button"
            className="reproductor-play"
            onClick={togglePlay}
            disabled={listaVacia}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="reproductor-espacio" />

          <button
            type="button"
            className={`reproductor-boton-lista ${listaAbierta ? 'abierta' : ''}`}
            onClick={onToggleLista}
            aria-expanded={listaAbierta}
          >
            <IconoLista />
            <span>Lista de canciones</span>
          </button>

          <div className="reproductor-volumen">
            <button
              type="button"
              className="reproductor-boton"
              onClick={toggleMute}
              aria-label={muted ? 'Activar sonido' : 'Silenciar'}
            >
              {volumenVisible === 0 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volumenVisible}
              onChange={(e) => {
                const v = Number(e.target.value);
                setVolume(v);
                if (muted && v > 0) toggleMute();
              }}
              aria-label="Volumen"
              style={{ '--relleno': `${volumenVisible * 100}%` } as CSSProperties}
            />
          </div>
        </div>

        <div className="reproductor-progreso">
          <span>{formatearTiempo(trackVisible ? progress : 0)}</span>
          <div className="reproductor-barra">
            <div className="reproductor-barra-relleno" style={{ width: `${porcentaje}%` }} />
          </div>
          <span>{formatearTiempo(trackVisible ? duration : 0)}</span>
        </div>
      </div>
    </div>
  );
}