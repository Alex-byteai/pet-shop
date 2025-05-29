import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import HomePage from './pages/home/HomePage';
import SearchResults from './pages/searchResult/SearchResults';
import ProductDetail from './pages/productDetail/ProductDetail';

// Páginas del carrito
import CartPage from './pages/cart/CartPage';
import Checkout from './pages/Checkout/Checkout';
import OrderComplete from './pages/OrderComplete/OrderComplete';

// Páginas del footer
import About from './pages/footer/About';
import Terms from './pages/footer/Terms';
import Privacy from './pages/footer/Privacy';
import FAQ from './pages/footer/FAQ';
import Shipping from './pages/footer/Shipping';
import Returns from './pages/footer/Returns';
import Contact from './pages/footer/Contact';
import Support from './pages/footer/Support';
import Feedback from './pages/footer/Feedback';

// Páginas admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserList from "./pages/admin/UserList";
import UserDetail from "./pages/admin/UserDetail";
import OrdersList from "./pages/admin/OrdersList";
import OrderDetail from "./pages/admin/OrderDetail";
import ProductList from "./pages/admin/ProductList";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import CategoryList from "./pages/admin/CategoryList";
import AddCategory from "./pages/admin/AddCategory";
import EditCategory from "./pages/admin/EditCategory";

// Páginas de autenticación
import LoginPage from './pages/auth/login/LoginPage';
import RegisterPage from './pages/auth/register/RegisterPage';
import RecoverPage from './pages/auth/recover/RecoverPage';

// Páginas de usuario
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import ChangePassword from './pages/user/ChangePassword';
import UserOrderDetail from './pages/user/OrderDetail';
import OrdersPage from './pages/user/OrdersPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route element={<Footer />}>
                  {/* Rutas principales */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/product/:productId" element={<ProductDetail />} />
                  <Route path="/cart" element={<CartPage />} />
                  
                  {/* Rutas que requieren autenticación */}
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  <Route path="/order-complete" element={
                    <ProtectedRoute>
                      <OrderComplete />
                    </ProtectedRoute>
                  } />

                  {/* Footer */}
                  <Route path="/about" element={<About />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route path="/returns" element={<Returns />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/feedback" element={<Feedback />} />

                  {/* Admin - Todas las rutas protegidas y solo para admin */}
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute adminOnly>
                      <UserList />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users/:userId" element={
                    <ProtectedRoute adminOnly>
                      <UserDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <ProtectedRoute adminOnly>
                      <OrdersList />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/orders/:orderId" element={
                    <ProtectedRoute adminOnly>
                      <OrderDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/products" element={
                    <ProtectedRoute adminOnly>
                      <ProductList />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/products/new" element={
                    <ProtectedRoute adminOnly>
                      <AddProduct />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/products/:productId" element={
                    <ProtectedRoute adminOnly>
                      <EditProduct />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/categories" element={
                    <ProtectedRoute adminOnly>
                      <CategoryList />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/categories/new" element={
                    <ProtectedRoute adminOnly>
                      <AddCategory />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/categories/:categoryId" element={
                    <ProtectedRoute adminOnly>
                      <EditCategory />
                    </ProtectedRoute>
                  } />

                  {/* Autenticación */}
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/auth/register" element={<RegisterPage />} />
                  <Route path="/auth/recover" element={<RecoverPage />} />

                  {/* Usuario - Rutas protegidas */}
                  <Route path="/user/dashboard" element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/user/profile" element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } />
                  <Route path="/user/change-password" element={
                    <ProtectedRoute>
                      <ChangePassword />
                    </ProtectedRoute>
                  } />
                  <Route path="/user/orders/:orderId" element={
                    <ProtectedRoute>
                      <UserOrderDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/user/orders" element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  } />
                </Route>
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
