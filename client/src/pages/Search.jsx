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
  const query =
    new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    setLoading(true);

    getProductos()
      .then((data) => setProductos(data))
      .finally(() => setLoading(false));
  }, []);

  const relacionados = productos.slice(0, 8);

  const resultadosBusqueda = useMemo(() => {
    if (!query) return [];

    return productos.filter((p) => {
      const text =
        `${p.nombre} ${p.categoria || ""} ${
          p.descripcion || ""
        }`.toLowerCase();

      return text.includes(query.toLowerCase());
    });
  }, [productos, query]);

  const filtrados = useMemo(() => {
    let result = [...resultadosBusqueda];

    if (activeCat) {
      result = result.filter(
        (p) =>
          (p.categoria || "").toLowerCase() ===
          activeCat.toLowerCase()
      );
    }

    switch (sort) {
      case "precio-asc":
        result.sort((a, b) => a.precio - b.precio);
        break;

      case "precio-desc":
        result.sort((a, b) => b.precio - a.precio);
        break;

      case "nombre":
        result.sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        );
        break;

      default:
        break;
    }

    return result;
  }, [resultadosBusqueda, sort, activeCat]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow px-6 md:px-12 py-10 md:py-14">
        <div className="max-w-7xl mx-auto">

          {resultadosBusqueda.length > 0 && (
            <>
              <div className="mb-10 md:mb-12">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

                  <div>
                    <h1 className="text-[32px] md:text-[40px] font-black tracking-[-0.04em] leading-none text-[#111]">
                      {query ? (
                        <>
                          Resultados para{" "}
                          <span className="font-medium text-gray-400">
                            "{query}"
                          </span>
                        </>
                      ) : (
                        "Todos los productos"
                      )}
                    </h1>
                  </div>

                  {!loading && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 font-medium">
                        {filtrados.length} productos encontrados
                      </span>
                    </div>
                  )}

                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-14 items-center">

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-11 px-5 rounded-full text-sm font-medium border border-gray-200 outline-none"
                >
                  <option value="relevancia">
                    Relevancia
                  </option>

                  <option value="precio-asc">
                    Precio ↑
                  </option>

                  <option value="precio-desc">
                    Precio ↓
                  </option>

                  <option value="nombre">
                    Nombre A-Z
                  </option>
                </select>

                {["Zapatillas", "Ropa", "Accesorios"].map(
                  (cat) => {
                    const active = activeCat === cat;

                    return (
                      <button
                        key={cat}
                        onClick={() =>
                          setActiveCat(
                            active ? null : cat
                          )
                        }
                        className={`h-11 px-5 rounded-full text-sm font-medium transition-all duration-300 border
                        ${
                          active
                            ? "bg-black text-white border-black shadow-[0_10px_24px_rgba(0,0,0,0.18)] scale-[1.03]"
                            : "bg-white text-gray-700 border-gray-200 hover:border-black hover:text-black"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  }
                )}

              </div>
            </>
          )}

          {!loading && resultadosBusqueda.length === 0 && (
            <div className="pt-14 pb-24">

              <div className="text-center mb-16">
                <h2 className="text-2xl font-semibold mb-2">
                  Sin resultados
                </h2>

                <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                  No encontramos productos relacionados con{" "}
                  <span className="text-black font-medium">
                    "{query}"
                  </span>
                </p>
              </div>

              {relacionados.length > 0 && (
                <section>

                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium">
                      Estos productos podrían interesarte
                    </h3>
                  </div>

                  <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">

                    {relacionados.map((p) => (
                      <div
                        key={p.id}
                        className="min-w-[220px] max-w-[220px]"
                      >
                        <ProductCard producto={p} />
                      </div>
                    ))}

                  </div>
                </section>
              )}

            </div>
          )}

          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-[30px] overflow-hidden border border-gray-100 animate-pulse"
                  >
                    <div className="h-[280px] bg-[#f3f3f3]" />

                    <div className="p-5">
                      <div className="h-2 w-14 rounded-full bg-[#f0f0f0] mb-4" />

                      <div className="space-y-2 mb-5">
                        <div className="h-4 rounded-full bg-[#f0f0f0] w-[85%]" />

                        <div className="h-4 rounded-full bg-[#f0f0f0] w-[60%]" />
                      </div>

                      <div className="h-5 rounded-full bg-[#f0f0f0] w-20" />
                    </div>
                  </div>
                ))}

            </div>
          )}

          {!loading && filtrados.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 animate-[fadeIn_.35s_ease] transition-all duration-300">

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