import { useState, createContext, useRef, useContext, useEffect, useCallback, type ReactNode } from 'react';
import { type TrackConDuracion } from '../data/playlist';
import { obtenerPlaylist } from '../data/playlistStore';
import { precargarArchivos, resolverUrl, estaListo } from '../data/archivosAudio';

export interface Track {
  nombre: string;
  artista: string;
  categoria: string;
  url: string;
}

export interface EntradaHistorial {
  track: Track;
  hora: number; // momento en que empezó a sonar (Date.now())
}

interface ReproductorProviderProps {
  children: ReactNode;
}

interface ReproductorContextType {
  isPlaying: boolean;
  currentTrack: Track | null;
  progress: number;
  duration: number;
  setProgress: (value: number) => void;
  volume: number;
  setVolume: (value: number) => void;
  muted: boolean;
  toggleMute: () => void;
  aleatorio: boolean;
  toggleAleatorio: () => void;
  genero: string | null;
  setGenero: (genero: string | null) => void;
  listaVacia: boolean;
  historial: EntradaHistorial[];
  proximas: TrackConDuracion[];
  autoplayBloqueado: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  analyserRef: React.RefObject<AnalyserNode | null>;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setTrack: (track: Track) => void;
}

export const ReproductorContext = createContext<ReproductorContextType | null>(null);

const RADIO_START = new Date('2026-01-01T00:00:00').getTime();
const MAX_HISTORIAL = 10;

// Compara nombres de género sin importar mayúsculas ni tildes ("Electrónica" = "electronica").
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// Canciones de la "emisora" actual: todas, o solo las del género elegido.
function obtenerLista(genero: string | null): TrackConDuracion[] {
  const todas = obtenerPlaylist();
  if (!genero) return todas;
  return todas.filter((t) => normalizar(t.categoria) === normalizar(genero));
}

// Modo radio: calcula qué canción está "al aire" ahora según la hora.
function calcularEstadoActual(lista: TrackConDuracion[]) {
  const duracionTotal = lista.reduce((acc, t) => acc + t.duracionSegundos, 0);
  const segundosTranscurridos = Math.floor((Date.now() - RADIO_START) / 1000) % duracionTotal;

  let acumulado = 0;
  for (const track of lista) {
    if (segundosTranscurridos < acumulado + track.duracionSegundos) {
      return { track, segundoEnCancion: segundosTranscurridos - acumulado };
    }
    acumulado += track.duracionSegundos;
  }

  return { track: lista[0], segundoEnCancion: 0 };
}

// Las canciones que vienen después de la actual en la emisora (solo en modo radio).
function calcularProximas(lista: TrackConDuracion[], actualUrl: string | undefined, cantidad: number): TrackConDuracion[] {
  if (lista.length <= 1) return [];
  let indice = actualUrl ? lista.findIndex((t) => t.url === actualUrl) : -1;
  if (indice < 0) {
    // Si no hay nada sonando de esta emisora, se toma la que está "al aire" ahora.
    indice = lista.indexOf(calcularEstadoActual(lista).track);
  }
  const resultado: TrackConDuracion[] = [];
  for (let i = 1; i <= Math.min(cantidad, lista.length - 1); i++) {
    resultado.push(lista[(indice + i) % lista.length]);
  }
  return resultado;
}

// Modo aleatorio: elige una canción al azar de la lista, distinta de la actual.
function elegirAleatoria(lista: TrackConDuracion[], actualUrl?: string): TrackConDuracion {
  const opciones = lista.length > 1 ? lista.filter((t) => t.url !== actualUrl) : lista;
  return opciones[Math.floor(Math.random() * opciones.length)];
}

export function ReproductorProvider({ children }: ReproductorProviderProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [muted, setMuted] = useState<boolean>(false);
  const [aleatorio, setAleatorio] = useState<boolean>(false);
  const [genero, setGeneroEstado] = useState<string | null>(null);
  const [historial, setHistorial] = useState<EntradaHistorial[]>([]);
  // El navegador no deja reproducir con sonido hasta que la persona toca algo en la página.
  const [autoplayBloqueado, setAutoplayBloqueado] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Copias en ref para que los eventos lean siempre el valor actual.
  const aleatorioRef = useRef<boolean>(false);
  const generoRef = useRef<string | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const trackRef = useRef<Track | null>(null);
  const inicioRef = useRef<number>(0);
  // Analizador de audio: lo usan las ondas del fondo para moverse con la música.
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  function cambiarSonando(valor: boolean) {
    isPlayingRef.current = valor;
    setIsPlaying(valor);
  }

  // En el Inicio (sin género elegido) siempre suena el mix aleatorio de todos los géneros.
  function esMix(): boolean {
    return aleatorioRef.current || generoRef.current === null;
  }

  // Le da play al <audio>. Si el navegador lo bloquea, lo marca para pedirle a la persona que toque algo.
  function darPlay() {
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => setAutoplayBloqueado(false))
      .catch((error: DOMException) => {
        cambiarSonando(false);
        if (error.name === 'NotAllowedError') setAutoplayBloqueado(true);
      });
  }

  // El navegador solo deja crear el AudioContext después de un clic, por eso se arma al dar play.
  function prepararAnalizador() {
    const audio = audioRef.current;
    if (!audio) return;
    // Si la persona todavía no tocó nada en la página, se espera: si no, el audio quedaría mudo.
    const activacion = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
    if (!audioCtxRef.current && activacion && !activacion.hasBeenActive) return;
    if (!audioCtxRef.current) {
      const ctx = new AudioContext();
      const fuente = ctx.createMediaElementSource(audio);
      const analizador = ctx.createAnalyser();
      analizador.fftSize = 128;
      analizador.smoothingTimeConstant = 0.8;
      fuente.connect(analizador);
      analizador.connect(ctx.destination);
      audioCtxRef.current = ctx;
      analyserRef.current = analizador;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }

  function cargarYReproducir(track: Track, desde: number) {
    const audio = audioRef.current;
    if (!audio) return;
    // Si es un archivo subido desde el panel y todavía no se cargó, se espera a que esté listo.
    if (!estaListo(track.url)) {
      precargarArchivos().then(() => {
        if (estaListo(track.url)) cargarYReproducir(track, desde);
        else detenerPorListaVacia();
      });
      return;
    }
    prepararAnalizador();
    if (trackRef.current?.url !== track.url) {
      // La canción que estaba sonando pasa al historial.
      const anterior = trackRef.current;
      if (anterior) {
        const entrada = { track: anterior, hora: inicioRef.current };
        setHistorial((h) => [entrada, ...h].slice(0, MAX_HISTORIAL));
      }
      inicioRef.current = Date.now();
      audio.src = resolverUrl(track.url);
    }
    audio.currentTime = desde;
    darPlay();
    trackRef.current = track;
    setCurrentTrack(track);
    cambiarSonando(true);
  }

  function detenerPorListaVacia() {
    audioRef.current?.pause();
    cambiarSonando(false);
  }

  function reproducirEnVivo() {
    const lista = obtenerLista(generoRef.current);
    if (lista.length === 0) return detenerPorListaVacia();
    const { track, segundoEnCancion } = calcularEstadoActual(lista);
    cargarYReproducir(track, segundoEnCancion);
  }

  function reproducirAleatoria() {
    const lista = obtenerLista(generoRef.current);
    if (lista.length === 0) return detenerPorListaVacia();
    cargarYReproducir(elegirAleatoria(lista, trackRef.current?.url), 0);
  }

  const play = () => {
    if (esMix()) {
      // En aleatorio, si había una canción pausada del mismo género, sigue desde donde quedó.
      const actual = trackRef.current;
      const mismoGenero = !generoRef.current || (actual && normalizar(actual.categoria) === normalizar(generoRef.current));
      if (actual && mismoGenero && audioRef.current?.src) {
        prepararAnalizador();
        darPlay();
        cambiarSonando(true);
      } else {
        reproducirAleatoria();
      }
    } else {
      reproducirEnVivo();
    }
  };

  const pause = () => {
    audioRef.current?.pause();
    cambiarSonando(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const toggleAleatorio = () => {
    const nuevo = !aleatorioRef.current;
    aleatorioRef.current = nuevo;
    setAleatorio(nuevo);
    // Si está sonando, el cambio se aplica al instante.
    if (isPlayingRef.current) {
      if (esMix()) reproducirAleatoria();
      else reproducirEnVivo();
    }
  };

  // Cambia la "emisora": null = mix de todos los géneros (Inicio), o un género ("Rock", "Pop"...).
  // Si está sonando, pasa enseguida a una canción de ese género.
  const setGenero = useCallback((nuevo: string | null) => {
    if (generoRef.current === nuevo) return;
    generoRef.current = nuevo;
    setGeneroEstado(nuevo);
    if (isPlayingRef.current) {
      if (esMix()) reproducirAleatoria();
      else reproducirEnVivo();
    }
    // Las funciones de adentro solo usan refs, por eso no hace falta recrearla.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMute = () => setMuted((m) => !m);

  const setTrack = (track: Track) => {
    cargarYReproducir(track, 0);
  };

  // Deja listos los archivos de audio subidos desde el panel.
  useEffect(() => {
    precargarArchivos();
  }, []);

  // Aplica volumen y silencio al elemento <audio>.
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.muted = muted;
  }, [volume, muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const actualizarProgreso = () => setProgress(audio.currentTime);
    const actualizarDuracion = () => setDuration(audio.duration);
    // Cuando termina una canción pasa a la siguiente según el modo.
    const alTerminar = () => {
      if (esMix()) reproducirAleatoria();
      else reproducirEnVivo();
    };

    audio.addEventListener('timeupdate', actualizarProgreso);
    audio.addEventListener('loadedmetadata', actualizarDuracion);
    audio.addEventListener('ended', alTerminar);

    return () => {
      audio.removeEventListener('timeupdate', actualizarProgreso);
      audio.removeEventListener('loadedmetadata', actualizarDuracion);
      audio.removeEventListener('ended', alTerminar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listaActual = obtenerLista(genero);
  const listaVacia = listaActual.length === 0;
  // En aleatorio (o en el mix del Inicio) no se sabe qué viene, así que no hay "próximas".
  const proximas = aleatorio || genero === null || listaVacia ? [] : calcularProximas(listaActual, currentTrack?.url, 3);

  const value = {
    isPlaying,
    currentTrack,
    progress,
    duration,
    setProgress,
    volume,
    setVolume,
    muted,
    toggleMute,
    aleatorio,
    toggleAleatorio,
    genero,
    setGenero,
    listaVacia,
    historial,
    proximas,
    autoplayBloqueado,
    audioRef,
    analyserRef,
    play,
    pause,
    togglePlay,
    setTrack,
  };

  return (
    <ReproductorContext.Provider value={value}>
      <audio ref={audioRef} />
      {children}
    </ReproductorContext.Provider>
  );
}

export function useReproductor() {
  const context = useContext(ReproductorContext);

  if (!context) {
    throw new Error('useReproductor debe usarse dentro de un ReproductorProvider');
  }

  return context;
}