import { useEffect, useState, useMemo } from "react";
import { X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProductos } from "../services/api";
import ProductCard from "./productCard";

const SearchOverlay = ({ open, onClose }) => {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [query, setQuery] = useState("");

  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      getProductos().then(setProductos);
      setQuery("");
    }
  }, [open]);

  // ESC para cerrar
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const filtrados = useMemo(() => {
    if (!query) return [];

    return productos
      .filter((p) => {
        const text = `${p.nombre} ${p.categoria || ""}`.toLowerCase();
        return text.includes(query.toLowerCase());
      })
      .slice(0, 10);
  }, [query, productos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    navigate(`/search?q=${query}`);
    onClose();
  };

  const goToProduct = (id) => {
    navigate(`/producto/${id}`);
    onClose();
  };

  useEffect(() => {
  if (open) {
    setVisible(true);
  } else {
    setTimeout(() => setVisible(false), 300); 
  }
}, [open]);

if (!visible) return null;

  return (
    <div
  className={`fixed inset-0 z-[999] bg-white/95 backdrop-blur-xl 
  will-change-transform transform
  ${open ? "animate-overlay" : "animate-overlay-out"}`}
>

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 animate-search">

        <img
          src="/assets/logo.png"
          alt="logo"
          className="w-14 h-10 object-contain"
        />

        {/* SEARCH */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 w-full max-w-2xl mx-6 
          bg-gray-100 px-5 py-2.5 rounded-full 
          focus-within:bg-gray-200
          transition-all duration-200"
        >
          <Search size={20} className="text-gray-500" />

          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar"
            className="w-full text-base outline-none bg-transparent placeholder-gray-400"
          />

          {/* CLEAR INPUT */}
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-gray-400 hover:text-black transition"
            >
              <X size={18} />
            </button>
          )}
        </form>

        {/* CANCELAR */}
        <button
          onClick={onClose}
          className="text-sm text-gray-600 hover:text-black transition"
        >
          Cancelar
        </button>
      </div>

      {/* RESULTADOS */}
      <div className="max-w-7xl mx-auto px-6 py-10 animate-content delay-75">

        {!query && (
          <p className="text-gray-400 text-sm">
            Empieza a escribir para buscar productos
          </p>
        )}

        {query && (
          <>
            <h3 className="text-sm text-gray-500 mb-5">
              Resultados
            </h3>

            {filtrados.length === 0 ? (
              <p className="text-gray-400">
                Sin resultados
              </p>
            ) : (
              <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">

                {filtrados.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => goToProduct(p.id)}
                    className="min-w-[220px] max-w-[220px] cursor-pointer hover:scale-105 transition"
                  >
                    <ProductCard producto={p} />
                  </div>
                ))}

              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default SearchOverlay;