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
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserList from "./pages/admin/UserList";
import UserDetail from "./pages/admin/UserDetail";
import OrdersList from "./pages/admin/OrdersList";
import OrderDetail from "./pages/admin/OrderDetail";

//Importando para el login
import LoginPage from './pages/auth/login/LoginPage';
import LoginSuccessPage from './pages/auth/loginSuccess/LoginSuccessPage';
import Register from './pages/auth/register/RegisterPage';
import Recover from './pages/auth/recover/RecoverPage';
import VerificationCodePage from './pages/auth/verificationCode/VerificationCodePage';
import DashboardPage from './pages/auth/dashboard/DashboardPage';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route element={<Footer />}>
              {/*Rutas principales de home-search-product*/}
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
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/users/:userId" element={<UserDetail />} />
              <Route path="/admin/orders" element={<OrdersList />} />
              <Route path="/admin/orders/:orderId" element={<OrderDetail />} />

              {/* Login */}
              <Route path="/auth/login" element={<LoginPage/>} />
              <Route path="/auth/loginSuccess" element={<LoginSuccessPage/>} />
              <Route path="/auth/register" element={<Register/>} />
              <Route path="/auth/recover" element={<Recover/>} />
              <Route path="/auth/verificationCode" element={<VerificationCodePage/>} />
              <Route path="/auth/dashboard" element={<DashboardPage/>} />
              </Route>
            </Routes>
          </main>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
