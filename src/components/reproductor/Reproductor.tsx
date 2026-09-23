  import { useReproductor } from '../../context/ReproductorContext';
  import './Reproductor.css';

  export default function Reproductor() {
    const { isPlaying, currentTrack, togglePlay, progress } = useReproductor();

    return (
      <div className="reproductor">
        <div className="reproductor-info">
          <h3>Radio 724</h3>
          <p>Escuchanos las 24 horas - música, entrevistas y producciones</p>
        </div>

        <div className="reproductor-controles">
          <button className="reproductor-play" onClick={togglePlay}>
            {isPlaying ? '⏸' : '▶'}
          </button>

          <div className="reproductor-barra">
            <div
              className="reproductor-barra-progreso"
              style={{ width: `${progress}%` }}
            />
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