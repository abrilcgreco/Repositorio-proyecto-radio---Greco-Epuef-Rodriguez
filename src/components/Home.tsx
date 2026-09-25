import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Reproductor from '../components/reproductor/Reproductor';
import './Home.css';
import 'swiper/css';
import 'swiper/css/navigation';

interface Categoria {
  id: number;
  nombre: string;
  imagenGif?: string;
}

const categoriasData: Categoria[] = [
  { id: 1, nombre: 'Rock', imagenGif: '/public/rock.gif' },
  { id: 2, nombre: 'Pop', imagenGif: '/public/pop.gif' },
  { id: 3, nombre: 'Cumbia', imagenGif: '/public/cumbia.gif' },
  { id: 4, nombre: 'Folklore', imagenGif: '/public/folklore.gif' },
  { id: 5, nombre: 'Electrónica', imagenGif: '/public/electronica.gif' },
];

export default function Home() {
  return (
    <main className="home-container">
      <section className="hero-section">
        <div className="mascota-container">
          <img
          src="/robotillie.png"
          alt="Robot Radio 724"
          className="mascota-img"
        />
        </div>
        <div className="reproductor-wrapper">
          <Reproductor />
        </div>
      </section>

      <section className="categorias-section">
        <h2 className="categorias-title">Categorías</h2>

        <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={24}
            slidesPerView={3}
            className="categorias-swiper"
          >
            {categoriasData.map((cat) => (
              <SwiperSlide key={cat.id}>
              <div className="categoria-card">
                 <img src={cat.imagenGif} alt="" className="categoria-icono" />
                <button className="genero-btn">{cat.nombre}</button>
              </div>
</SwiperSlide>
            ))}
        </Swiper>
      </section>
    </main>
  );
}