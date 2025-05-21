import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import HomePage from './pages/home/HomePage';
import SearchResults from './pages/searchResult/SearchResults';
import ProductDetail from './pages/productDetail/ProductDetail';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
