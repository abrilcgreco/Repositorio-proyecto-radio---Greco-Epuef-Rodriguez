import { noticias } from "../data/noticias";
import "./Novedades.css";

export default function Novedades() {
  return (
    <main className="novedades">
      <h1 className="novedades-titulo">Noticias y novedades</h1>
      <p className="novedades-subtitulo">
        Enterate de las Actividades del taller, producciones destacadas y
        encuentros interescuela
      </p>

      <section className="noticias-grid">
        {noticias.map((n) => (
          <article key={n.id} className="noticia-card">
            <div className="noticia-imagen">
              {n.imagen && <img src={n.imagen} alt={n.titulo} />}
            </div>
            <div className="noticia-texto">
              <h2 className="noticia-titulo">{n.titulo}</h2>
              <p className="noticia-resumen">{n.resumen}</p>
              <button type="button" className="noticia-leer">
                Leer mas
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="redes-banner">
        <h2 className="redes-texto">
          ¡Para enterarte de más seguinos en nuestras redes sociales!
        </h2>

        <div className="redes-iconos">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
              <circle cx="12" cy="12" r="4.5" />
              <circle cx="17.7" cy="6.3" r="0.9" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
          </a>
        </div>

        <img className="redes-mascota" src="/ili.png" alt="Mascota de la radio" />
      </section>
    </main>
  );
}