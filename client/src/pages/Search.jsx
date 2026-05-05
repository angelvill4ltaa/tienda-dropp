import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/productCard";
import Footer from "../components/Footer";
import { getProductos } from "../services/api";

const Search = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState("relevancia");
  const [activeCat, setActiveCat] = useState(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    setLoading(true);
    getProductos()
      .then((data) => setProductos(data))
      .finally(() => setLoading(false));
  }, []);

   const relacionados = useMemo(() => {
    return productos.slice(0, 8); 
   }, [productos]);

  const filtrados = useMemo(() => {
    let result = [...productos];

    if (query) {
      result = result.filter((p) => {
        const text = `${p.nombre} ${p.categoria || ""} ${p.descripcion || ""}`.toLowerCase();
        return text.includes(query.toLowerCase());
      });
    }

    // CATEGORY FILTER
    if (activeCat) {
      result = result.filter(
        (p) => (p.categoria || "").toLowerCase() === activeCat.toLowerCase()
      );
    }

    // SORT
    switch (sort) {
      case "precio-asc":
        result.sort((a, b) => a.precio - b.precio);
        break;
      case "precio-desc":
        result.sort((a, b) => b.precio - a.precio);
        break;
      case "nombre":
        result.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      default:
        break;
    }

    return result;
  }, [productos, query, sort, activeCat]);

  const resetFilters = () => {
    setActiveCat(null);
    setSort("relevancia");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <main className="flex-grow px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mb-10 flex items-center justify-between">

              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                {query ? (
                 <>
                   Resultados para{" "}
                   <span className="text-black font-medium">"{query}"</span>
                 </>
               ) : (
                 "Todos los productos"
               )}
              </h1>
                       
              {!loading && (
               <span className="text-xs text-gray-400">
                  {filtrados.length} productos
               </span>
      )}
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-3 mb-10 items-center">

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 rounded-full text-sm bg-white shadow-soft outline-none hover:shadow-md transition"
            >
              <option value="relevancia">Relevancia</option>
              <option value="precio-asc">Precio ↑</option>
              <option value="precio-desc">Precio ↓</option>
              <option value="nombre">Nombre A-Z</option>
            </select>

            {["Zapatillas", "Ropa", "Accesorios"].map((cat) => {
              const active = activeCat === cat;

              return (
                <button
                  key={cat}
                  onClick={() =>
                    setActiveCat(active ? null : cat)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-200
                  ${
                    active
                      ? "bg-black text-white shadow-soft scale-105"
                      : "bg-white text-gray-700 hover:bg-black hover:text-white shadow-soft"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {!loading && filtrados.length === 0 && (
  <div className="py-20">

    <div className="text-center mb-14">
      <h2 className="text-2xl font-semibold mb-2">
        No encontramos resultados
      </h2>

      <p className="text-gray-400 text-sm">
        Intenta con otro término o explora productos
      </p>
    </div>

    {/* RELACIONADOS */}
    {relacionados.length > 0 && (
      <section>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">
            Productos recomendados
          </h3>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">

          {relacionados.map((p) => (
            <div
              key={p.id}
              className="min-w-[220px] max-w-[220px] hover:scale-105 transition"
            >
              <ProductCard producto={p} />
            </div>
          ))}

        </div>
      </section>
    )}

  </div>
)}

          {/* LOADING */}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl shadow-soft animate-pulse">
                  <div className="h-40 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}

          {/* RESULTS */}
          {!loading && filtrados.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {filtrados.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;