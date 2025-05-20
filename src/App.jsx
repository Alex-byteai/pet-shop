import { Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import HomePage from "./pages/home/HomePage";
import CartPage from "./pages/cart/CartPage";
import LoginPage from "./pages/login/LoginPage";
import ProducDetail from "./pages/productDetail/ProductDetail";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserList from "./pages/admin/UserList";
import UserDetail from "./pages/admin/UserDetail";
import OrdersList from "./pages/admin/OrdersList";
import OrderDetail from "./pages/admin/OrderDetail";

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/product/:id" element={<ProducDetail />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/admin/users/:userId" element={<UserDetail />} />
          <Route path="/admin/orders" element={<OrdersList />} />
          <Route path="/admin/orders/:orderId" element={<OrderDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
