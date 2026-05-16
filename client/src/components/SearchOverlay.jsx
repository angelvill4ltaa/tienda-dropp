import { useEffect, useState } from "react";
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
      setQuery("");

      if (productos.length === 0) {
        getProductos().then(setProductos);
      }
    }
  }, [open]);

  const filtrados = !query
    ? []
    : productos
        .filter((p) => {
          const text = `${p.nombre} ${p.categoria || ""}`.toLowerCase();
          return text.includes(query.toLowerCase());
        })
      .slice(0, 5);

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
  className={`fixed inset-0 z-[999] bg-white
  ${open ? "animate-overlay" : "animate-overlay-out"}`}
>

      <div className="flex items-center justify-between px-6 md:px-10 py-5">

        <img
          src="/assets/logo.png"
          alt="logo"
          className="w-14 h-10 object-contain"
        />

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 w-full max-w-2xl mx-6 
          bg-gray-200 px-4 py-2 rounded-full"
        >
          <Search size={20} className="text-gray-600" />

          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar"
            className="w-full outline-none bg-transparent font-medium"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-gray-800"
            >
              <X size={18} />
            </button>
          )}
        </form>

        <button
          onClick={onClose}
          className="text-sm text-gray-500 font-medium"
        >
          Cancelar
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 pb-8">

        {!query && (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-sm text-gray-500 mb-4 font-medium">
              Términos de búsqueda populares
            </h3>

            <div className="flex flex-col items-start">
              {["Jordan", "Nike", "Bucket", "Nike Tech"].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    navigate(`/search?q=${term}`);
                    onClose();
                  }}
                  className="text-sm font-medium text-black py-1.5">
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
              <div className="flex gap-4 pb-4">

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