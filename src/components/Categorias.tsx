import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useSearchParams } from "react-router-dom";
import { categorias } from "../data/categorias";
import { coloresEscuela } from "../data/canciones";
import IconoCategoria from "./IconoCategoria";
import { useReproductor, normalizar } from "../context/ReproductorContext";
import "./Categorias.css";

const TOTAL = categorias.length;
// Distancia entre el centro de la tarjeta central y la primera de cada lado, y entre las laterales.
const SEPARACION_CENTRO = 270;
const SEPARACION_LATERAL = 230;

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
  // Si se llega con ?genero=Rock en la dirección, arranca en ese género.
  // Se compara sin tildes ni mayúsculas para que "Electrónica" siempre coincida.
  const [params] = useSearchParams();
  const generoUrl = params.get("genero") ?? "";
  const indiceUrl = categorias.findIndex((c) => normalizar(c) === normalizar(generoUrl));

  const [actual, setActual] = useState<number>(Math.max(0, indiceUrl));

  // Si cambia el género de la URL estando ya en la página, se actualiza el carrusel.
  useEffect(() => {
    if (indiceUrl >= 0) setActual(indiceUrl);
  }, [indiceUrl]);

  const { setGenero } = useReproductor();

  // El reproductor pasa a la emisora del género que está en el centro.
  useEffect(() => {
    setGenero(categorias[actual]);
  }, [actual, setGenero]);

  const anterior = () => setActual((a) => (a - 1 + TOTAL) % TOTAL);
  const siguiente = () => setActual((a) => (a + 1) % TOTAL);

  useEffect(() => {
    function teclas(e: KeyboardEvent): void {
      if (e.key === "ArrowRight") setActual((a) => (a + 1) % TOTAL);
      if (e.key === "ArrowLeft") setActual((a) => (a - 1 + TOTAL) % TOTAL);
    }
    window.addEventListener("keydown", teclas);
    return () => window.removeEventListener("keydown", teclas);
  }, []);

  const nombre = categorias[actual];
  const color = coloresEscuela[actual % coloresEscuela.length];

  const estiloFondo = {
    "--fondo-arriba": color.oscuro,
    "--fondo-abajo": color.claro,
    "--texto": color.texto,
  } as CSSProperties;

  return (
    <main className="categorias" style={estiloFondo}>
      <h1 className="categorias-titulo">{nombre}</h1>

      <div className="categorias-zona">
        <section className="carrusel" aria-label="Categorías">
          <button type="button" className="carrusel-flecha carrusel-flecha--izq" onClick={anterior} aria-label="Categoría anterior">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {categorias.map((cat, i) => {
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
              <button type="button" key={cat} className={clases.join(" ")} style={estilo} onClick={() => setActual(i)} aria-label={cat} aria-current={pos === 0 ? "true" : undefined} tabIndex={oculta ? -1 : 0}>
                <IconoCategoria nombre={cat} className="carrusel-icono" />
                <span className="carrusel-nombre">{cat}</span>
              </button>
            );
          })}

          <button type="button" className="carrusel-flecha carrusel-flecha--der" onClick={siguiente} aria-label="Categoría siguiente">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </section>

        <div className="carrusel-puntos" role="tablist" aria-label="Elegir categoría">
          {categorias.map((cat, i) => (
            <button
              type="button"
              key={cat}
              role="tab"
              aria-selected={i === actual}
              aria-label={cat}
              className={i === actual ? "activo" : ""}
              onClick={() => setActual(i)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}