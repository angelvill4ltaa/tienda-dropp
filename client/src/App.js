import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import { AuthProvider } from "./context/AuthContext";

import "./App.css";

import MainLayout from "./layout/MainLayout";

import Home from "./pages/Home";
import Zapatillas from "./pages/Zapatillas";
import Ropa from "./pages/Ropa";
import Accesorios from "./pages/Accesorios";
import ProductDetail from "./pages/ProductDetail";
import LibroReclamaciones from "./pages/LibroReclamaciones";
import Search from "./pages/Search";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";

import AccountVerified from "./pages/AccountVerified";
import VerifyExpired from "./pages/VerifyExpired";

function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <BrowserRouter>

        <Routes>

          {/* Con Navbar */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/zapatillas" element={<Zapatillas />} />
            <Route path="/ropa" element={<Ropa />} />
            <Route path="/accesorios" element={<Accesorios />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/search" element={<Search />} />
          </Route>

          {/* Sin Navbar */}
          <Route path="/reclamaciones" element={<LibroReclamaciones />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orden-exitosa/:id" element={<OrderSuccess />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/account-verified" element={<AccountVerified />} />
          <Route path="/verify-expired" element={<VerifyExpired />} />
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  </StoreProvider>
  );
}

export default App;