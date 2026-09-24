import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Reproductor from '../components/reproductor/Reproductor';
import './Home.css';
import 'swiper/css';
import 'swiper/css/navigation';

interface Categoria {
  id: number;
  nombre: string;
  imagenBg?: string;
}

const categoriasData: Categoria[] = [
  { id: 1, nombre: 'Género 1' },
  { id: 2, nombre: 'Género 2' },
  { id: 3, nombre: 'Género 3' },
  { id: 4, nombre: 'Género 4' },
  { id: 5, nombre: 'Género 5' },
  { id: 6, nombre: 'Género 6' },
];

export default function Home() {
  return (
    <main className="home-container">
      <section className="hero-section">
        <div className="mascota-container">
          <img
            src="/robotGif.gif"
            alt="Robot animado Radio 724"
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
          spaceBetween={20}
          slidesPerView={3}
          className="categorias-swiper"
        >
          {categoriasData.map((cat) => (
            <SwiperSlide key={cat.id}>
              <div className="categoria-card">
                <button className="genero-btn">{cat.nombre}</button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </main>
  );
}