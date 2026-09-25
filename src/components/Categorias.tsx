import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { canciones, coloresEscuela } from "../data/canciones";
import "./Categorias.css";

const TOTAL = canciones.length;
const SEPARACION_CENTRO = 353.5;
const SEPARACION_LATERAL = 294;

function posicionRelativa(indice: number, actual: number): number {
  let d = (indice - actual) % TOTAL;
  if (d > TOTAL / 2) d -= TOTAL;
  if (d < -TOTAL / 2) d += TOTAL;
  return d;
}

function desplazamiento(pos: number): number {
  if (pos === 0) return 0;
  const signo = pos > 0 ? 1 : -1;
  return signo * (SEPARACION_CENTRO + (Math.abs(pos) - 1) * SEPARACION_LATERAL);
}

export default function Categorias() {
  const [actual, setActual] = useState<number>(0);
  const [sonando, setSonando] = useState<boolean>(false);

  useEffect(() => {
    function teclas(e: KeyboardEvent): void {
      if (e.key === "ArrowRight") setActual((a) => (a + 1) % TOTAL);
      if (e.key === "ArrowLeft") setActual((a) => (a - 1 + TOTAL) % TOTAL);
    }
    window.addEventListener("keydown", teclas);
    return () => window.removeEventListener("keydown", teclas);
  }, []);

  const cancion = canciones[actual];
  const color = coloresEscuela[actual % coloresEscuela.length];

  const estiloFondo = {
    "--fondo-arriba": color.oscuro,
    "--fondo-abajo": color.claro,
    "--texto": color.texto,
  } as CSSProperties;

  return (
    <>
      <Header />

      <main className="categorias" style={estiloFondo}>
        <h1 className="categorias-titulo">Género</h1>

        <section className="carrusel" aria-label="Canciones">
          {canciones.map((c, i) => {
            const pos = posicionRelativa(i, actual);
            const oculta = Math.abs(pos) >= 3;
            const clases = ["carrusel-item"];
            if (pos === 0) clases.push("central");
            if (oculta) clases.push("oculta");

            const estilo = {
              "--x": `${desplazamiento(pos)}px`,
              zIndex: 10 - Math.abs(pos),
            } as CSSProperties;

            return (
              <button type="button" key={c.id} className={clases.join(" ")} style={estilo} onClick={() => setActual(i)} aria-label={`${c.nombre}, ${c.artista}`} aria-current={pos === 0 ? "true" : undefined} tabIndex={oculta ? -1 : 0}>
                {c.portada && <img src={c.portada} alt="" />}
              </button>
            );
          })}
        </section>

        <div className="categorias-info">
          <p>{cancion.nombre}</p>
          <p>{cancion.artista}</p>
        </div>

        <button type="button" className="categorias-play" onClick={() => setSonando((s) => !s)} aria-label={sonando ? "Pausar" : "Reproducir"}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            {sonando ? (
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            ) : (
              <path d="M8 5v14l11-7z" />
            )}
          </svg>
        </button>
      </main>

      <Footer />
    </>
  );
}