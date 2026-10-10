// Íconos propios de cada género, dibujados en SVG con los colores de la radio.
// Las animaciones están en IconoCategoria.css.
import { useId, type ReactElement } from 'react';
import './IconoCategoria.css';

// Guitarra eléctrica (la usa Rock internacional).
const GUITARRA = (
  <g className="ic-rock-guitarra"><g transform="rotate(38 32 32)">
    <path d="M29 3h6l1.5 8h-9z" fill="#f4ede6"/>
    <rect x="30" y="10" width="4" height="27" rx="1" fill="#1c1a19" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 35c-6 0-8 6-5 10-4 4-2 13 6 13h14c8 0 10-9 6-13 3-4 1-10-5-10-3 0-4 2-8 2s-5-2-8-2z" fill="#e8762f" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="26.5" y="43" width="11" height="3" rx="1" fill="#1c1a19"/>
    <rect x="26.5" y="49" width="11" height="3" rx="1" fill="#1c1a19"/>
  </g></g>
);

// Guitarra eléctrica con el cuerpo pintado con la bandera argentina.
// "id" hace falta porque el recorte (clipPath) necesita un nombre único en la página.
function guitarraArgentina(id: string): ReactElement {
  const cuerpo = 'M24 35c-6 0-8 6-5 10-4 4-2 13 6 13h14c8 0 10-9 6-13 3-4 1-10-5-10-3 0-4 2-8 2s-5-2-8-2z';
  return (
    <g className="ic-rock-guitarra"><g transform="rotate(38 32 32)">
      <defs>
        <clipPath id={id}><path d={cuerpo}/></clipPath>
      </defs>
      <path d="M29 3h6l1.5 8h-9z" fill="#f4ede6"/>
      <rect x="30" y="10" width="4" height="27" rx="1" fill="#1c1a19" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <g clipPath={`url(#${id})`}>
        <rect x="10" y="30" width="44" height="13" fill="#74acdf"/>
        <rect x="10" y="43" width="44" height="7" fill="#ffffff"/>
        <rect x="10" y="50" width="44" height="12" fill="#74acdf"/>
      </g>
      <g className="ic-sol-guitarra">
        <path d="M32 41.6v1.4M32 50v1.4M27.1 46.5h1.4M35.5 46.5h1.4M28.5 43l1 1M34.5 49l1 1M28.5 50l1-1M34.5 44l1-1" stroke="#f6b24a" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="32" cy="46.5" r="2.2" fill="#f6b24a"/>
      </g>
      <path d={cuerpo} fill="none" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    </g></g>
  );
}

const ICONOS: Record<string, ReactElement> = {
  // Guitarra con un rayo
  'Rock internacional': (
    <>
      {GUITARRA}
      <path className="ic-rock-rayo" d="M14 6l-6 11h6l-3 9 9-13h-6l3-7z" fill="#f6b24a"/>
    </>
  ),
  // Maracas
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
      <path className="ic-vibra" d="M8 14q-3 4 0 8M56 14q3 4 0 8" stroke="#f4ede6" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </>
  ),
  // Acordeón
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
  // Parlante que late con el bajo
  'RKT': (
    <>
      <rect x="14" y="5" width="36" height="54" rx="4" fill="#1c1a19" stroke="#f4ede6" strokeWidth="2.4" strokeLinejoin="round"/>
      <circle cx="32" cy="17" r="6" fill="#e8762f" stroke="#f4ede6" strokeWidth="2"/>
      <circle cx="32" cy="17" r="2" fill="#1c1a19"/>
      <g className="ic-cono">
        <circle cx="32" cy="41" r="12" fill="#e8762f" stroke="#f4ede6" strokeWidth="2.4"/>
        <circle cx="32" cy="41" r="6" fill="#f6b24a"/>
        <circle cx="32" cy="41" r="2" fill="#1c1a19"/>
      </g>
      <path className="ic-vibra" d="M8 34q-3 7 0 14M56 34q3 7 0 14" stroke="#f4ede6" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </>
  ),
  // Micrófono con brillos
  'Reguetón': (
    <>
      <g className="ic-pop-mic">
        <path d="M28 33h8l-1.5 22a2.5 2.5 0 0 1-5 0z" fill="#1c1a19" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="25.5" y="29" width="13" height="5" rx="2" fill="#f4ede6"/>
        <circle cx="32" cy="18" r="11.5" fill="#e8762f" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 15h18M22 20.5h20" stroke="#1c1a19" strokeWidth="1.6" opacity=".45" strokeLinecap="round"/>
        <path d="M26 11a8 8 0 0 1 6-3" stroke="#f4ede6" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".8"/>
      </g>
      <path className="ic-brillo b1" d="M12 12l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" fill="#f6b24a"/>
      <path className="ic-brillo b2" d="M53 26l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill="#f6b24a"/>
      <path className="ic-brillo b3" d="M49 46l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" fill="#f4ede6"/>
    </>
  ),
  // Auriculares con ecualizador
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
  // Trofeo con el 50 y la base celeste y blanca
  'Top 50 Argentina': (
    <>
      <g className="ic-trofeo">
        <path d="M20 12h-6a7 7 0 0 0 7.5 11M44 12h6a7 7 0 0 1-7.5 11" fill="none" stroke="#f4ede6" strokeWidth="2.4" strokeLinecap="round"/>
        <path d="M20 7h24v15a12 12 0 0 1-24 0z" fill="#f6b24a" stroke="#f4ede6" strokeWidth="2.4" strokeLinejoin="round"/>
        <text x="32" y="25" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1c1a19" fontFamily="Poppins, Arial, sans-serif">50</text>
        <path d="M29 34h6v8h-6z" fill="#f4ede6"/>
        <rect x="19" y="42" width="26" height="12" rx="2" fill="#74acdf" stroke="#f4ede6" strokeWidth="2.4"/>
        <rect x="20.2" y="46.2" width="23.6" height="3.6" fill="#f4ede6"/>
      </g>
      <path className="ic-brillo b1" d="M10 12l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" fill="#f6b24a"/>
      <path className="ic-brillo b2" d="M54 26l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill="#f4ede6"/>
    </>
  ),
  // Casete con los carretes girando
  '80, 90 y 2000': (
    <>
      <rect x="5" y="13" width="54" height="38" rx="4" fill="#e8762f" stroke="#f4ede6" strokeWidth="2.4" strokeLinejoin="round"/>
      <rect x="11" y="19" width="42" height="17" rx="2" fill="#f4ede6"/>
      <rect x="16" y="23" width="32" height="9" rx="4.5" fill="#1c1a19"/>
      <g className="ic-carrete r1">
        <circle cx="22" cy="27.5" r="3.2" fill="#f6b24a"/>
        <path d="M22 24.8v5.4M19.3 27.5h5.4" stroke="#1c1a19" strokeWidth="1.3"/>
      </g>
      <g className="ic-carrete r2">
        <circle cx="42" cy="27.5" r="3.2" fill="#f6b24a"/>
        <path d="M42 24.8v5.4M39.3 27.5h5.4" stroke="#1c1a19" strokeWidth="1.3"/>
      </g>
      <path d="M17 51l4-8h22l4 8" fill="#1c1a19" stroke="#f4ede6" strokeWidth="2.4" strokeLinejoin="round"/>
      <circle cx="11" cy="45" r="1.7" fill="#1c1a19"/>
      <circle cx="53" cy="45" r="1.7" fill="#1c1a19"/>
    </>
  ),
  // Guitarra criolla con notas musicales
  'Chacarera': (
    <>
      <g className="ic-criolla">
        <g transform="rotate(-16 32 34)">
          <rect x="30.4" y="6" width="3.2" height="18" fill="#1c1a19" stroke="#f4ede6" strokeWidth="1.8"/>
          <rect x="28" y="1.5" width="8" height="7" rx="1.5" fill="#1c1a19" stroke="#f4ede6" strokeWidth="1.8"/>
          <circle cx="26.6" cy="3.6" r="1.3" fill="#f6b24a"/><circle cx="26.6" cy="6.6" r="1.3" fill="#f6b24a"/>
          <circle cx="37.4" cy="3.6" r="1.3" fill="#f6b24a"/><circle cx="37.4" cy="6.6" r="1.3" fill="#f6b24a"/>
          <path d="M32 21c-6 0-10 3.5-10 8.5 0 3 1.5 4.5 1.5 6s-4.5 3.5-4.5 9c0 7 6 12 13 12s13-5 13-12c0-5.5-4.5-7.5-4.5-9s1.5-3 1.5-6c0-5-4-8.5-10-8.5z" fill="#e8762f" stroke="#f4ede6" strokeWidth="2.4" strokeLinejoin="round"/>
          <circle cx="32" cy="35" r="5.2" fill="#f6b24a"/>
          <circle cx="32" cy="35" r="3.8" fill="#1c1a19"/>
          <rect x="26.5" y="45" width="11" height="2.6" rx="1" fill="#1c1a19"/>
          <path d="M31 8v38M32 8v38M33 8v38" stroke="#f4ede6" strokeWidth=".5" opacity=".75"/>
        </g>
      </g>
      <g className="ic-nota n1" fill="#f6b24a">
        <circle cx="50" cy="16" r="2.6"/>
        <path d="M52 16V6l4 1.5" stroke="#f6b24a" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      </g>
      <g className="ic-nota n2" fill="#f4ede6">
        <circle cx="10" cy="22" r="2.2"/>
        <path d="M11.8 22v-8.5l3.4 1.3" stroke="#f4ede6" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      </g>
    </>
  ),
  // Vinilo: se usa para cualquier género que no tenga ícono propio
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

// Compara sin tildes ni mayúsculas ("Regueton" también encuentra "Reguetón").
function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

interface IconoCategoriaProps {
  nombre: string;
  className?: string;
}

export default function IconoCategoria({ nombre, className }: IconoCategoriaProps) {
  const id = 'bandera' + useId().replace(/:/g, '');

  // Rock nacional: guitarra con la bandera y una banderita flameando al lado
  if (normalizar(nombre) === normalizar('Rock nacional')) {
    return (
      <svg className={`icono-genero ${className ?? ''}`} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <g className="ic-banderita">
          <path d="M6 4v24" stroke="#f4ede6" strokeWidth="2" strokeLinecap="round"/>
          <path d="M7 5h13v4.3H7z" fill="#74acdf"/>
          <path d="M7 9.3h13v4.3H7z" fill="#ffffff"/>
          <path d="M7 13.6h13v4.3H7z" fill="#74acdf"/>
          <circle cx="13.5" cy="11.45" r="1.3" fill="#f6b24a"/>
        </g>
        {guitarraArgentina(id)}
      </svg>
    );
  }

  const clave = Object.keys(ICONOS).find((k) => normalizar(k) === normalizar(nombre)) ?? 'Otros';
  return (
    <svg className={`icono-genero ${className ?? ''}`} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      {ICONOS[clave]}
    </svg>
  );
}