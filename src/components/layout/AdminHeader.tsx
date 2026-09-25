import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

export default function AdminHeader() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function salir(): void {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/admin" className="header-logo" aria-label="Inicio">
          <img src="/logo.png" alt="Logo de la radio" />
        </Link>
        <nav className="header-nav">
          <ul className="header-links">
            <li><NavLink to="/admin" end>Inicio</NavLink></li>
          </ul>
        </nav>
        <button className="admin-salir" onClick={salir}>
          Salir de administrador
        </button>
      </div>
    </header>
  );
}