import { useState, createContext, useRef, useContext, useEffect, type ReactNode } from 'react';
import { playlist, type TrackConDuracion } from '../data/playlist';

interface Track {
  nombre: string;
  artista: string;
  categoria: string;
  url: string;
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
  audioRef: React.RefObject<HTMLAudioElement | null>;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setTrack: (track: Track) => void;
}

export const ReproductorContext = createContext<ReproductorContextType | null>(null);

const RADIO_START = new Date('2026-01-01T00:00:00').getTime();

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

export function ReproductorProvider({ children }: ReproductorProviderProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = () => {
    const { track, segundoEnCancion } = calcularEstadoActual(playlist);

    if (audioRef.current) {
      if (currentTrack?.url !== track.url) {
        audioRef.current.src = track.url;
      }
      audioRef.current.currentTime = segundoEnCancion;
      audioRef.current.play();
    }

    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const setTrack = (track: Track) => {
    setCurrentTrack(track);
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const actualizarProgreso = () => setProgress(audio.currentTime);
    const actualizarDuracion = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', actualizarProgreso);
    audio.addEventListener('loadedmetadata', actualizarDuracion);

    return () => {
      audio.removeEventListener('timeupdate', actualizarProgreso);
      audio.removeEventListener('loadedmetadata', actualizarDuracion);
    };
  }, []);

  const value = {
    isPlaying,
    currentTrack,
    progress,
    duration,
    setProgress,
    volume,
    setVolume,
    audioRef,
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