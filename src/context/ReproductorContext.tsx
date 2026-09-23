import { useState, createContext, useRef, useContext, useEffect, type ReactNode } from 'react';

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

export function ReproductorProvider({ children }: ReproductorProviderProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = () => {
    audioRef.current?.play();
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

  const actualizarProgreso = () => {
    if (audio.duration) {
      const porcentaje = (audio.currentTime / audio.duration) * 100;
      setProgress(porcentaje);
    }
  };

  audio.addEventListener('timeupdate', actualizarProgreso);
  return () => audio.removeEventListener('timeupdate', actualizarProgreso);
}, []);

  const value = {
    isPlaying,
    currentTrack,
    progress,
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