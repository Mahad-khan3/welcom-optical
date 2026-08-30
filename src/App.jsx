import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Loading from './components/Loading'
import Preloader from './components/Preloader'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastProvider } from './components/Toast'

import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import Categories from './pages/Categories'
import PremiumGlasses from './pages/PremiumGlasses'
import Sunglasses from './pages/Sunglasses'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import About from './pages/About'
import Legal from './pages/Legal'
import AdminLogin from './pages/AdminLogin'

import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import Products from './admin/Products'
import AddProduct from './admin/AddProduct'
import EditProduct from './admin/EditProduct'
import CategoriesAdmin from './admin/Categories'
import AddCategory from './admin/AddCategory'
import EditCategory from './admin/EditCategory'
import Orders from './admin/Orders'
import OrderDetails from './admin/OrderDetails'
import Customers from './admin/Customers'
import Settings from './admin/Settings'
import HomepageSections from './admin/HomepageSections'
import ShowcaseManager from './admin/ShowcaseManager'
import VideosManager from './admin/VideosManager'
import SignatureDuoManager from './admin/SignatureDuoManager'
import GalleryManager from './admin/GalleryManager'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <CartDrawer />}
      <ErrorBoundary key={location.pathname}>
        <div className="page-enter">
          <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/category/:category" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/collections" element={<Categories />} />
        <Route path="/premium-glasses" element={<PremiumGlasses />} />
        <Route path="/sunglasses" element={<Sunglasses />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Legal type="privacy" />} />
        <Route path="/terms" element={<Legal type="terms" />} />
        <Route path="/shipping" element={<Legal type="shipping" />} />
        <Route path="/returns" element={<Legal type="returns" />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:id" element={<OrderSuccess />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="products/:id/edit" element={<EditProduct />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="categories/new" element={<AddCategory />} />
          <Route path="categories/:id/edit" element={<EditCategory />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
          <Route path="adjust" element={<HomepageSections />} />
          <Route path="showcase" element={<ShowcaseManager />} />
          <Route path="videos" element={<VideosManager />} />
          <Route path="signature" element={<SignatureDuoManager />} />
          <Route path="gallery" element={<GalleryManager />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ErrorBoundary>
      {!isAdminRoute && <Footer />}
    </>
  )
}

function RequireAdmin({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loading full />
  if (!user) return <Navigate to="/admin/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  const [loading, setLoading] = useState(() => {
    try {
      const seen = localStorage.getItem('welcom_preloader_seen')
      return !seen || window.location.pathname === '/'
    } catch {
      return false
    }
  })

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <ScrollToTop />
            <ToastProvider>
              <main>
              <Preloader onDone={() => setLoading(false)} />
              {loading ? null : <AnimatedRoutes />}
              </main>
            </ToastProvider>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
