import { ShoppingCart, Search, Menu, X, ChevronDown, LogOut } from "lucide-react";
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
    title: "Cerrar sesión",
    text: "Tu sesión actual se cerrará.",

    showCancelButton: true,
    confirmButtonText: "Cerrar sesión",
    cancelButtonText: "Cancelar",

    reverseButtons: true,
    buttonsStyling: false,

    customClass: {
      popup: "swal2-premium-popup",
      confirmButton: "swal2-premium-confirm",
      cancelButton: "swal2-premium-cancel",
      actions: "swal2-premium-actions",
    },
  }).then((result) => {
    if (!result.isConfirmed) return;

    logout();

    Swal.fire({
      title: "Sesión cerrada",
      text: "Has salido correctamente de tu cuenta.",
      icon: "success",

      confirmButtonText: "Continuar",
      buttonsStyling: false,

      customClass: {
        popup: "swal2-premium-popup",
        confirmButton: "swal2-premium-confirm",
      },
    }).then(() => navigate("/"));
  });
};

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
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
        className={`sticky top-0 z-50 transition duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 h-[68px]"
            : "bg-white h-[76px]"
        }`}
      >
        <div className="flex h-full items-center justify-between px-6 md:px-14">

          <Link to="/" className="z-50">
            <img
              src="/assets/logo.png"
              alt="logo"
              className={`object-contain transition-all duration-500 ${
                scrolled ? "h-8 w-12" : "h-11 w-[62px]"
              }`}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-10 ml-10">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-[13px] font-medium tracking-[0.04em] transition-colors duration-300 ${
                  isActive(item.path)
                    ? "text-black"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {item.name}

                <span
                  className={`absolute left-0 -bottom-[8px] h-[1.5px] bg-black transition-all duration-300 ${
                    isActive(item.path) ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center">

            <div
              onClick={() => setSearchOpen(true)}
              className={`hidden md:flex items-center px-4 h-[42px] rounded-full cursor-text transition-all duration-300 mr-3 w-[220px]
              ${
                searchOpen
                  ? "scale-95 opacity-0"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <Search size={16} className="text-gray-600 " />
              <span className="px-2 text-sm text-gray-400 font-medium">
                Buscar 
              </span>
            </div>

            <button
              onClick={() => setOpenCart(true)}
              className="relative w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all duration-300 mr-3"
            >
              <ShoppingCart size={20} />

              {carrito.length > 0 && (
                <span className="absolute top-[7px] right-[7px] min-w-4 h-4 px-1 rounded-full bg-black text-white text-[9px] flex items-center justify-center">
                  {carrito.length}
                </span>
              )}
            </button>

            {user ? (
              <div ref={profileRef} className="hidden md:block relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 rounded-full px-2 py-2 transition hover:bg-gray-100"
                >
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-semibold uppercase">
                    {user.nombre?.charAt(0)}
                  </div>

                  <span className="text-sm text-gray-700 max-w-[90px] font-medium ">
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
                  <div className="absolute right-0 z-50 mt-3 w-64 animate-[fadeIn_.25s_ease] rounded-[28px] border border-gray-100 bg-white p-3">

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
                className="hidden h-10 items-center rounded-full border border-gray-200 px-5 text-sm font-medium text-gray-700 md:flex"
              >
                Iniciar sesión
              </button>
            )}

            <button
              className="flex h-10 w-10 items-center justify-center md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

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