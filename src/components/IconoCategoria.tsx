// Íconos propios de cada género, dibujados en SVG con los colores de la radio.
// Las animaciones están en IconoCategoria.css.
import type { ReactElement } from 'react';
import './IconoCategoria.css';

const ICONOS: Record<string, ReactElement> = {
  'Rock': (
    <>
      <g className="ic-rock-guitarra"><g transform="rotate(38 32 32)">
        <path d="M29 3h6l1.5 8h-9z" fill="#f4ede6"/>
        <rect x="30" y="10" width="4" height="27" rx="1" fill="#1c1a19" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24 35c-6 0-8 6-5 10-4 4-2 13 6 13h14c8 0 10-9 6-13 3-4 1-10-5-10-3 0-4 2-8 2s-5-2-8-2z" fill="#e8762f" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="26.5" y="43" width="11" height="3" rx="1" fill="#1c1a19"/>
        <rect x="26.5" y="49" width="11" height="3" rx="1" fill="#1c1a19"/>
      </g></g>
      <path className="ic-rock-rayo" d="M14 6l-6 11h6l-3 9 9-13h-6l3-7z" fill="#f6b24a"/>
    </>
  ),
  'Pop': (
    <>
      <g className="ic-pop-mic">
        <path d="M28 33h8l-1.5 22a2.5 2.5 0 0 1-5 0z" fill="#1c1a19" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="25.5" y="29" width="13" height="5" rx="2" fill="#f4ede6"/>
        <circle cx="32" cy="18" r="11.5" fill="#e8762f" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 15h18M22 20.5h20" stroke="#1c1a19" strokeWidth="1.6" opacity=".45" strokeLinecap="round"/><path d="M26 11a8 8 0 0 1 6-3" stroke="#f4ede6" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".8"/>
      </g>
      <path className="ic-brillo b1" d="M12 12l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" fill="#f6b24a"/>
      <path className="ic-brillo b2" d="M53 26l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill="#f6b24a"/>
      <path className="ic-brillo b3" d="M49 46l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" fill="#f4ede6"/>
    </>
  ),
  'Folklore': (
    <>
      <g className="ic-bombo">
        <path d="M12 28v20c0 4 9 7 20 7s20-3 20-7V28" fill="#e8762f" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 33l6 17 6-17 6 17 6-17 6 17 5-15" fill="none" stroke="#1c1a19" strokeWidth="2" strokeLinejoin="round"/>
        <ellipse cx="32" cy="28" rx="20" ry="6.5" fill="#f4ede6" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        <ellipse cx="32" cy="28" rx="15" ry="4" fill="#e9dccd"/>
      </g>
      <g className="ic-palo">
        <path d="M47 6L36 24" stroke="#f6b24a" strokeWidth="2.6" strokeLinecap="round"/>
        <circle cx="48.5" cy="4.8" r="3.6" fill="#f4ede6"/>
      </g>
    </>
  ),
  'Cumbia': (
    <>
      <g className="ic-maraca m1">
        <path d="M21 34L12 56" stroke="#f4ede6" strokeWidth="3.2" strokeLinecap="round"/>
        <ellipse cx="24" cy="22" rx="8.5" ry="12" transform="rotate(22 24 22)" fill="#e8762f" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 18c4 2 8 4 13 6M16.5 24c4 2 7 3.5 11 5" stroke="#f6b24a" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </g>
      <g className="ic-maraca m2">
        <path d="M43 34L52 56" stroke="#f4ede6" strokeWidth="3.2" strokeLinecap="round"/>
        <ellipse cx="40" cy="22" rx="8.5" ry="12" transform="rotate(-22 40 22)" fill="#f6b24a" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M47 18c-4 2-8 4-13 6M47.5 24c-4 2-7 3.5-11 5" stroke="#e8762f" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </g>
      <path className="ic-vibra" d="M6 10q-3 4 0 8M58 10q3 4 0 8" stroke="#f4ede6" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </>
  ),
  'Cuarteto': (
    <>
      <g className="ic-fuelle">
        <path d="M21 17h22v30H21z" fill="#1c1a19" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M25.5 17v30M30 17v30M34 17v30M38.5 17v30" stroke="#e8762f" strokeWidth="2.2"/>
      </g>
      <rect x="7" y="14" width="15" height="36" rx="3" fill="#e8762f" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="22" r="1.8" fill="#f4ede6"/><circle cx="17" cy="22" r="1.8" fill="#f4ede6"/>
      <circle cx="12" cy="28" r="1.8" fill="#f4ede6"/><circle cx="17" cy="28" r="1.8" fill="#f4ede6"/>
      <circle cx="12" cy="34" r="1.8" fill="#f4ede6"/><circle cx="17" cy="34" r="1.8" fill="#f4ede6"/>
      <rect x="42" y="14" width="15" height="36" rx="3" fill="#e8762f" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M46 19h7M46 24h7M46 29h7M46 34h7M46 39h7M46 44h7" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round"/>
    </>
  ),
  'Electrónica': (
    <>
      <path d="M12 36v-6a20 20 0 0 1 40 0v6" fill="none" stroke="#f4ede6" strokeWidth="3.2" strokeLinecap="round"/>
      <rect x="8" y="34" width="10" height="18" rx="4" fill="#e8762f" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="46" y="34" width="10" height="18" rx="4" fill="#e8762f" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <g fill="#f6b24a">
        <rect className="ic-eq e1" x="23" y="34" width="3.4" height="18" rx="1.7"/>
        <rect className="ic-eq e2" x="28.3" y="34" width="3.4" height="18" rx="1.7"/>
        <rect className="ic-eq e3" x="33.6" y="34" width="3.4" height="18" rx="1.7"/>
        <rect className="ic-eq e4" x="38.9" y="34" width="3.4" height="18" rx="1.7"/>
      </g>
    </>
  ),
  'Otros': (
    <>
      <g className="ic-vinilo">
        <circle cx="30" cy="34" r="23" fill="#1c1a19" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="30" cy="34" r="17" fill="none" stroke="#4a4441" strokeWidth="1.2"/>
        <circle cx="30" cy="34" r="13" fill="none" stroke="#4a4441" strokeWidth="1.2"/>
        <path d="M14 26a18 18 0 0 1 9-9" stroke="#f4ede6" strokeWidth="1.6" strokeLinecap="round" opacity=".6" fill="none"/>
        <circle cx="30" cy="34" r="8" fill="#e8762f"/>
        <circle cx="30" cy="34" r="1.8" fill="#1c1a19"/>
      </g>
      <path d="M55 6v18l-11 12" fill="none" stroke="#f4ede6" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="55" cy="6" r="3.4" fill="#f6b24a"/>
    </>
  ),
};

// Compara sin tildes ni mayúsculas ("Electronica" también encuentra "Electrónica").
function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

interface IconoCategoriaProps {
  nombre: string;
  className?: string;
}

export default function IconoCategoria({ nombre, className }: IconoCategoriaProps) {
  const clave = Object.keys(ICONOS).find((k) => normalizar(k) === normalizar(nombre)) ?? 'Otros';
  return (
    <svg className={`icono-genero ${className ?? ''}`} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      {ICONOS[clave]}
    </svg>
  );
}