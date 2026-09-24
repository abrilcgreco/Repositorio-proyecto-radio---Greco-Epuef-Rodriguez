import { useReproductor } from '../../context/ReproductorContext';
import './Reproductor.css';

export default function Reproductor() {
  const { isPlaying, currentTrack, togglePlay } = useReproductor();

  return (
    <div className="reproductor">
      <div className="reproductor-info">
        <h3>Radio 724</h3>
        <p>Escuchanos las 24 horas - música, entrevistas y producciones</p>
      </div>

      <div className="reproductor-controles">
        <button className="reproductor-play" onClick={togglePlay}>
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className={`reproductor-onda ${isPlaying ? 'reproductor-onda--activa' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className="reproductor-track">
        <p className="reproductor-nombre">{currentTrack?.nombre ?? 'Nombre de canción'}</p>
        <p className="reproductor-artista">{currentTrack?.artista ?? 'Artista'}</p>
        <p className="reproductor-categoria">{currentTrack?.categoria ?? 'Categoría'}</p>
      </div>
    </div>
  );
}