import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

// Componentes comunes
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

// Páginas principales
import HomePage from "./pages/home/HomePage";
import SearchResults from "./pages/searchResult/SearchResults";
import ProductDetail from "./pages/productDetail/ProductDetail";

// Páginas del carrito
import CartPage from "./pages/cart/CartPage";
import Checkout from "./pages/Checkout/Checkout";
import OrderComplete from "./pages/OrderComplete/OrderComplete";

// Páginas del footer
import About from "./pages/footer/About";
import Terms from "./pages/footer/Terms";
import Privacy from "./pages/footer/Privacy";
import FAQ from "./pages/footer/FAQ";
import Shipping from "./pages/footer/Shipping";
import Returns from "./pages/footer/Returns";
import Contact from "./pages/footer/Contact";
import Support from "./pages/footer/Support";
import Feedback from "./pages/footer/Feedback";

// Páginas de autenticación
import LoginPage from "./pages/auth/login/LoginPage";
import LoginSuccessPage from "./pages/auth/loginSuccess/LoginSuccessPage";
import Register from "./pages/auth/register/RegisterPage";
import Recover from "./pages/auth/recover/RecoverPage";
import VerificationCodePage from "./pages/auth/verificationCode/VerificationCodePage";
import DashboardPage from "./pages/auth/dashboard/DashboardPage";

// Páginas del administrador
import AdminDashboard from "./pages/admin/admindashboard/AdminDashboard";
import UserList from "./pages/admin/UserList/UserList";
import UserDetail from "./pages/admin/UserDetail/UserDetail";
import OrdersList from "./pages/admin/OrdersList/OrdersList";
import OrderDetail from "./pages/admin/OrderDetail/OrderDetail";
import ListaProductos from "./pages/admin/listaproductos/ListaProductos";
import AgregarProducto from "./pages/admin/agregarproducto/AgregarProducto";
import DetalleProducto from "./pages/admin/detalleproducto/DetalleProducto";

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Rutas principales */}
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/product/:productId" element={<ProductDetail />} />

              {/* Rutas del carrito */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-complete" element={<OrderComplete />} />

              {/* Footer pages */}
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/support" element={<Support />} />
              <Route path="/feedback" element={<Feedback />} />

              {/* Rutas de autenticación */}
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/loginSuccess" element={<LoginSuccessPage />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/recover" element={<Recover />} />
              <Route
                path="/auth/verificationCode"
                element={<VerificationCodePage />}
              />
              <Route path="/auth/dashboard" element={<DashboardPage />} />

              {/* Rutas del administrador */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/users/:userId" element={<UserDetail />} />
              <Route path="/admin/orders" element={<OrdersList />} />
              <Route path="/admin/orders/:orderId" element={<OrderDetail />} />
              <Route
                path="/admin/listaproductos"
                element={<ListaProductos />}
              />
              <Route
                path="/admin/agregarproducto"
                element={<AgregarProducto />}
              />
              <Route
                path="/admin/editarproducto"
                element={<DetalleProducto />}
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
