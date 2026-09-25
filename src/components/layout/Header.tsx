import { Link, NavLink } from 'react-router-dom';
import './Header.css';
import logo from "../../assets/logo.png";

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo" aria-label="Inicio">
          <img src={logo} alt="Logo de la radio" />
        </Link>
        <nav className="header-nav">
          <ul className="header-links">
            <li><NavLink to="/" end>Inicio</NavLink></li>
            <li><NavLink to="/categorias">Categorías</NavLink></li>
            <li><NavLink to="/novedades">Novedades</NavLink></li>
          </ul>
          <Link to="/login" className="header-login">ingresar</Link>
        </nav>
      </div>
    </header>
  );
}