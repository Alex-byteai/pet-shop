import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import HomePage from './pages/home/HomePage';
import SearchResults from './pages/searchResult/SearchResults';
import ProductDetail from './pages/productDetail/ProductDetail';
import ShoppingCart from './pages/ShoppingCart/ShoppingCart';
import Checkout from './pages/Checkout/Checkout';
import OrderComplete from './pages/OrderComplete/OrderComplete';


//Importando página para usuario
import UserProfile from './pages/users/UserProfile';


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
import CategoryList from './pages/admin/CategoryList';
import AddCategory from './pages/admin/AddCategory';


//Importando para el login
import LoginPage from './pages/login/LoginPage';
import InicioC from './pages/login/InicioC';
import Register from './pages/login/Register';
import Recover from './pages/login/Recover';
import VerificarCodigo from './pages/login/Codigo';


import './App.css';


function App() {
  return (
    <Router>
      <CartProvider>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              {/*Rutas principales de home-search-product*/}
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<ShoppingCart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-complete" element={<OrderComplete />} />


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
              <Route path="/admin/categories" element={<CategoryList />} />
              <Route path="/admin/categories/add" element={<AddCategory />} />
             
              {/* Login */}
              <Route path="/login/LoginPage" element={<LoginPage/>} />
              <Route path="/login/InicioC" element={<InicioC/>} />
              <Route path="/login/Register" element={<Register/>} />
              <Route path="/login/Recover" element={<Recover/>} />
              <Route path="/login/Codigo" element={<VerificarCodigo/>} />
             
              {/*users*/}
              <Route path="/user/profile" element={<UserProfile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}


export default App;
