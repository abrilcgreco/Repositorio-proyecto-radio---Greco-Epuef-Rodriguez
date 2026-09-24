import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-col">
        <h3 className="naranja">Sobre Nosotros</h3>
        <p>
          Somos un taller de multimedios de la E.S.E.T.P. N°724, sonamos todos los días a toda hora con música, ideas y compañía para toda la comunidad. 
        </p>
      </div>

      <div className="footer-col">
        <h3 className="amarillo">Redes</h3>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
        <a href="https://sitio-institucional.com" target="_blank" rel="noreferrer">Sitio institucional</a>
      </div>

      <div className="footer-col">
        <h3 className="rojo">Categorías</h3>
        <Link to="/">Inicio</Link>
        <Link to="/programas">Programas</Link>
        <Link to="/noticias">Noticias</Link>
      </div>
      <Link to="/login" className="footer-admin-link" aria-label="Acceso administrador">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm3 8H9V7a3 3 0 016 0v3z" />
      </svg>
</Link>
    </footer>
  );
}