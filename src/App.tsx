import Header from './components/layout/Header'
import Footer from './components/layout/Footer';
import { ReproductorProvider } from './context/ReproductorContext';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Categorias from './components/Categorias';
import Novedades from './components/Novedades';

function App() {
  return (
    <ReproductorProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Categorias />} />
        <Route path="/contact" element={<Novedades />} />
      </Routes>
      <Footer />
    </ReproductorProvider>
  );
}

export default App;