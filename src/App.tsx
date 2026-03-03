import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AdminRoute from './components/AdminRoute'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import FAQ from './pages/FAQ'
import About from './pages/About'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ProductList from './pages/admin/ProductList'
import ProductForm from './pages/admin/ProductForm'
import StoreSettings from './pages/admin/StoreSettings'

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 前台路由 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="login" element={<Login />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>

        {/* 管理後台路由 */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="settings" element={<StoreSettings />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}
