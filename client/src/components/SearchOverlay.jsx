import { useEffect, useState, useMemo } from "react";
import { X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProductos } from "../services/api";
import SearchProductCard from "./SearchProductCard";

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
  will-change-transform transform overflow-hidden
  ${open ? "animate-overlay" : "animate-overlay-out"}`}
>

      <div className="flex items-center justify-between px-6 md:px-14 py-6 animate-search">

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
          <Search size={20} className="text-gray-600" />

          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar"
            className="w-full text-base outline-none bg-transparent placeholder-gray-400 font-medium"
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

        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-black transition font-medium"
        >
          Cancelar
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-4 pb-8 animate-content delay-75 overflow-hidden">

        {!query && (
          <div className="pl-[284px]">
            <h3 className="text-sm text-gray-500 mb-4 font-medium">
              Términos de búsqueda populares
            </h3>

            <div className="flex flex-col items-start ">
              {["Jordan", "Nike", "Bucket", "Tech", "Retro"].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    navigate(`/search?q=${term}`);
                    onClose();
                  }}
                  className="h-8 text-sm font-medium text-black">
                 {term}
              </button>
            ))}
          </div>
        </div>
      )}

        {query && (
          <>
            {filtrados.length === 0 ? (
              <p className="text-gray-400">
                Sin resultados
              </p>
            ) : (
              <div className="flex gap-5 overflow-x-auto overflow-y-hidden pb-4 scrollbar-hide">

                {filtrados.map((p) => (
                  <SearchProductCard
                    key={p.id}
                    producto={p}
                    onClick={() => goToProduct(p.id)}
                  />
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