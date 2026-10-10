import { useEffect, useRef } from 'react';
import { categorias } from '../data/categorias';
import IconoCategoria from './IconoCategoria';
import { useReproductor } from '../context/ReproductorContext';
import './Home.css';

export default function Home() {
  const { setGenero } = useReproductor();
  const homeRef = useRef<HTMLElement | null>(null);

  // En el Inicio suena el mix de todas las canciones. Se empieza con el botón de play del reproductor.
  useEffect(() => {
    setGenero(null);
  }, [setGenero]);

  // El Inicio es una sola pantalla: ocupa justo el alto que queda debajo del header y no se scrollea.
  useEffect(() => {
    const home = homeRef.current;
    if (!home) return;
    const html = document.documentElement;
    const overflowAntes = html.style.overflow;
    window.scrollTo(0, 0);

    function ajustar() {
      if (!home) return;
      const esCelular = window.innerWidth <= 760;
      html.style.overflow = esCelular ? overflowAntes : 'hidden';
      const arriba = home.getBoundingClientRect().top + window.scrollY;
      home.style.height = esCelular ? '' : `${window.innerHeight - arriba}px`;
    }

    ajustar();
    window.addEventListener('resize', ajustar);
    return () => {
      window.removeEventListener('resize', ajustar);
      html.style.overflow = overflowAntes;
    };
  }, []);

  return (
    <main className="home" ref={homeRef}>
      <section className="home-encabezado">
        <p className="home-etiqueta">Radio escolar · E.S.E.T.P. N°724 · Trelew, Chubut</p>
        <h1 className="home-titulo">¡Géneros que tenemos para vos!</h1>
      </section>

      {/* Cartel que explica qué suena en el Inicio */}
      <div className="home-cartel">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
        </svg>
        <p>
          Estás escuchando una <strong>reproducción aleatoria de todos los géneros</strong>.
          Si querés escuchar un género en particular, entrá a la sección <strong>Categorías</strong>.
        </p>
      </div>

      {/* Los géneros solo se muestran. Al pasar el mouse, invitan a ir a Categorías. */}
      <section className="generos-grid" aria-label="Géneros">
        {categorias.map((nombre) => (
          <div key={nombre} className="genero-card">
            <IconoCategoria nombre={nombre} className="genero-icono" />
            <span className="genero-nombre">{nombre}</span>
            <span className="genero-tip" role="tooltip">
              ¿Te gustaría escuchar <strong>{nombre}</strong>? Entrá a la sección Categorías.
            </span>
          </div>
        ))}
      </section>
    </main>
  );
}