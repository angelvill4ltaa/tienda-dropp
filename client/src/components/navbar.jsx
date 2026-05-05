import { ShoppingCart, Search, Menu, X, ChevronDown, User2, Package, LogOut} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import SearchOverlay from "./SearchOverlay";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { carrito, setOpenCart } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    Swal.fire({
      title: '<span style="font-size:28px;font-weight:800;color:#111;">Cerrar sesión</span>',
      html: `
        <p style="font-size:14px;color:#666;line-height:1.8;margin-top:8px;">
          Saldrás de tu cuenta actual y deberás iniciar sesión nuevamente para acceder a tus compras y beneficios.
        </p>
      `,
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#000",
      cancelButtonColor: "#f3f3f3",
      width: "470px",
      padding: "2em",
      borderRadius: "24px",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        logout();

        Swal.fire({
          icon: "success",
          title: '<span style="font-size:24px;font-weight:800;">Sesión finalizada</span>',
          html: `
            <p style="font-size:14px;color:#666;line-height:1.7;">
              Tu cuenta ha sido cerrada correctamente.
            </p>
          `,
          confirmButtonText: "Continuar",
          confirmButtonColor: "#000",
          width: "430px",
          padding: "2em",
          borderRadius: "24px",
        }).then(() => {
          navigate("/");
        });
      }
    });
  };

  useEffect(() => {
    const onScroll = () => {
      const shouldScroll = window.scrollY > 8;
      setScrolled((prev) => (prev !== shouldScroll ? shouldScroll : prev));
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeProfile = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", closeProfile);
    return () => document.removeEventListener("mousedown", closeProfile);
  }, []);

  const menuItems = [
    { name: "Inicio", path: "/" },
    { name: "Zapatillas", path: "/zapatillas" },
    { name: "Ropa", path: "/ropa" },
    { name: "Accesorios", path: "/accesorios" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-gray-100 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 h-14"
            : "bg-white h-16"
        }`}
      >
        <div className="flex items-center justify-between px-5 md:px-10 h-full">

          {/* LOGO */}
          <Link to="/" className="group z-50">
            <img
              src="/assets/logo.png"
              alt="logo"
              className={`object-contain transition-all duration-300 ${
                scrolled ? "w-11 h-7" : "w-14 h-10"
              } group-hover:scale-105`}
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-9">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-[14px] font-medium tracking-wide transition-colors ${
                  isActive(item.path)
                    ? "text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {item.name}

                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300 ${
                    isActive(item.path) ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center">

            {/* SEARCH */}
            <div
              onClick={() => setSearchOpen(true)}
              className={`hidden md:flex items-center px-4 h-11 rounded-full cursor-text transition-all duration-300 mr-4 w-[210px]
              ${
                searchOpen
                  ? "scale-95 opacity-0"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <Search size={16} className="text-gray-500" />
              <span className="px-2 text-sm text-gray-400">
                Buscar 
              </span>
            </div>

            {/* CART */}
            <button
              onClick={() => setOpenCart(true)}
              className="relative w-11 h-11 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all duration-300 mr-5"
            >
              <ShoppingCart size={20} />

              {carrito.length > 0 && (
                <span className="absolute top-1 right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-medium">
                  {carrito.length}
                </span>
              )}
            </button>

            {/* AUTH */}
            {user ? (
              <div ref={profileRef} className="hidden md:block relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 hover:bg-gray-100 px-2.5 py-2 rounded-full transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold uppercase">
                    {user.nombre?.charAt(0)}
                  </div>

                  <span className="text-sm text-gray-700 max-w-[90px] truncate">
                    {user.nombre}
                  </span>

                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-300 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-[28px] shadow-[0_22px_55px_rgba(0,0,0,0.09)] p-3 z-50 animate-[fadeIn_.25s_ease]">

                    <div className="px-3 py-3 border-b border-gray-100 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold uppercase">
                        {user.nombre?.charAt(0)}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-black truncate">
                          {user.nombre}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 text-sm text-red-500 hover:bg-red-50 rounded-2xl transition"
                      >
                        <LogOut size={16} />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="hidden md:flex items-center h-10 px-5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:border-black hover:text-black transition-all duration-300"
              >
                Iniciar sesión
              </button>
            )}

            {/* MOBILE BUTTON */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden border-t bg-white px-5 py-6 space-y-6 animate-[fadeIn_.25s_ease]">

            <div
              onClick={() => setSearchOpen(true)}
              className="flex items-center bg-gray-100 px-4 h-11 rounded-full cursor-text"
            >
              <Search size={16} className="text-gray-500" />
              <span className="px-2 text-sm text-gray-400">
                Buscar 
              </span>
            </div>

            <div className="flex flex-col gap-5">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm transition ${
                    isActive(item.path)
                      ? "text-black font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {user ? (
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <p className="text-sm text-gray-600">
                  Hola, <span className="font-semibold text-black">{user.nombre}</span>
                </p>

                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate("/auth");
                  setMenuOpen(false);
                }}
                className="h-11 px-5 rounded-full border border-gray-200 text-sm font-medium text-gray-700"
              >
                Iniciar sesión
              </button>
            )}
          </div>
        )}
      </header>

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;