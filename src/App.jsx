import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import HomePage from './pages/home/HomePage';
import SearchResults from './pages/searchResult/SearchResults';
import ProductDetail from './pages/productDetail/ProductDetail';

// Importando páginas del footer
import About from './pages/footer/About';
import Terms from './pages/footer/Terms';
import Privacy from './pages/footer/Privacy';
import FAQ from './pages/footer/FAQ';
import Shipping from './pages/footer/Shipping';
import Returns from './pages/footer/Returns';
import Contact from './pages/footer/Contact';
import Support from './pages/footer/Support';
import Feedback from './pages/footer/Feedback';

// Importando páginas para el admin
import AdminDashboard from "./pages/admin/admindashboard/AdminDashboard";
import UserList from "./pages/admin/UserList";
import UserDetail from "./pages/admin/UserDetail";
import OrdersList from "./pages/admin/OrdersList";
import OrderDetail from "./pages/admin/OrderDetail";

// Lista de productos y otras páginas del admin
import ListaProductos from "./pages/admin/listaproductos/ListaProductos";
import AgregarProducto from "./pages/admin/agregarproducto/AgregarProducto";
import DetalleProducto from "./pages/admin/detalleproducto/DetalleProducto"; // ✅ NUEVA IMPORTACIÓN

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Rutas principales de home-search-product */}
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/product/:productId" element={<ProductDetail />} />

              {/* Rutas del footer */}
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/support" element={<Support />} />
              <Route path="/feedback" element={<Feedback />} />

              {/* Admin */}
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/users/:userId" element={<UserDetail />} />
              <Route path="/admin/orders" element={<OrdersList />} />
              <Route path="/admin/orders/:orderId" element={<OrderDetail />} />

              {/* Responsabilidades alumno5 */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/listaproductos" element={<ListaProductos />} />
              <Route path="/admin/agregarproducto" element={<AgregarProducto />} />
              <Route path="/admin/editarproducto" element={<DetalleProducto />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;

