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
        <Link to="/login">Acceso administrador</Link>
      </div>
    </footer>
  );
}