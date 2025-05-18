import { Routes, Route} from 'react-router-dom'
import Header from './components/header/Header'
import HomePage from './pages/home/HomePage'
import CartPage from './pages/cart/CartPage'
import LoginPage from './pages/login/LoginPage'
import ProducDetail from './pages/productDetail/ProductDetail'
import Footer from './components/footer/Footer'

function App() {

  return (
    <>
      <div className='App'>
        <Header />
        <main className='main-content'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/product/:id' element={<ProducDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
