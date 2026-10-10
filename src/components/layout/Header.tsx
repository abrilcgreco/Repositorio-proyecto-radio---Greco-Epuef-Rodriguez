import { Link, NavLink } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo de la escuela + nombre de la radio y del taller */}
        <Link to="/" className="header-marca" aria-label="Radio 724 - Inicio">
          <img src="/logo.png" alt="Logo de la E.S.E.T.P. N°724" className="header-logo-img" />
          <span className="header-marca-texto">
            <span className="header-marca-nombre">Radio 724</span>
            <span className="header-marca-taller">Taller de Multimedios · E.S.E.T.P. N°724</span>
          </span>
        </Link>

        <nav className="header-nav">
          <ul className="header-links">
            <li><NavLink to="/" end>Inicio</NavLink></li>
            <li><NavLink to="/categorias">Categorías</NavLink></li>
          </ul>

          <Link to="/login" className="header-candado" aria-label="Iniciar sesión" title="Iniciar sesión">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm3 8H9V7a3 3 0 016 0v3z" />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  );
}