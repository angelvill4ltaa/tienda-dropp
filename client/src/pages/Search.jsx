import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/productCard";
import Footer from "../components/Footer";
import { getProductos } from "../services/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Search = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState("relevancia");
  const [activeCat, setActiveCat] = useState(null);

  const [page, setPage] = useState(1);

  const perPage = 18;

  const sliderRef = useRef(null);

  const location = useLocation();

  const query =
    new URLSearchParams(location.search).get("q") ?? "";

  useEffect(() => {
    setLoading(true);

    getProductos()
      .then((data) => setProductos(data))
      .finally(() => setLoading(false));
  }, []);

  const relacionados = productos.slice(0, 6);

  const resultadosBusqueda = !query
    ? []
    : productos.filter((p) => {
        const text = `
          ${p.nombre} 
          ${p.categoria || ""} 
          ${p.descripcion || ""}
          `.toLowerCase();

        return text.includes(query.toLowerCase());
      });

  const filtrados = [...resultadosBusqueda];

  if (activeCat) {
    filtrados = filtrados.filter(
      (p) =>
        (p.categoria || "").toLowerCase() ===
        activeCat.toLowerCase()
    );
  }

  switch (sort) {
    case "precio-asc":
      filtrados.sort(
        (a, b) => a.precio - b.precio
      );
      break;

    case "precio-desc":
      filtrados.sort(
        (a, b) => b.precio - a.precio
      );
      break;

    case "nombre":
      filtrados.sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );
      break;

    default:
      break;
  }

  const totalPages = Math.ceil(
    filtrados.length / perPage
  );

  const start = (page - 1) * perPage;

  const currentProducts = filtrados.slice(
    start,
    start + perPage
  );

  useEffect(() => {
    setPage(1);
  }, [sort, activeCat, query]);

  const scroll = (dir) => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <section className="w-full border-b bg-white">

        <div className="max-w-[1700px] mx-auto px-5 md:px-16 pt-5 pb-4">

          {resultadosBusqueda.length > 0 && (
            <>
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div>

                  <h1 className="text-[34px] md:text-[42px] leading-none font-bold">

                    {query ? (
                      <>
                        Resultados para{" "}
                        <span className="text-black/40">
                          "{query}"
                        </span>
                      </>
                    ) : (
                      "Todos los productos"
                    )}

                  </h1>

                  {!loading && (
                    <p className="text-sm text-black/40 mt-2 font-medium">
                      {filtrados.length} productos
                      encontrados
                    </p>
                  )}

                </div>

                <div className="flex flex-wrap items-center gap-3">

                  <select
                    value={sort}
                    onChange={(e) =>
                      setSort(e.target.value)
                    }
                    className="h-11 cursor-pointer rounded-full border border-black/10 bg-white px-5 pr-11 text-sm font-medium outline-none"
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

                  {[
                    "Zapatillas",
                    "Ropa",
                    "Accesorios",
                  ].map((cat) => {
                    const active = activeCat === cat;

                    return (
                      <button
                        key={cat}
                        onClick={() =>
                          setActiveCat(
                            active ? null : cat
                          )
                        }
                        className={`h-11 rounded-full border px-5 text-sm font-medium transition-all
                        ${
                          active
                            ? "bg-black text-white border-black"
                            : "bg-white border-black/10"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}

                </div>

              </div>

            </>
          )}

        </div>

      </section>

      <main className="w-full max-w-[1700px] mx-auto px-8 md:px-24 pt-6 pb-24">

        {!loading &&
          resultadosBusqueda.length === 0 && (
            <div className="pt-14 pb-24">

              <div className="text-center mb-16">

                <h2 className="text-2xl font-semibold mb-2">
                  Sin resultados
                </h2>

                <p className="text-gray-400 text-sm max-w-md mx-auto">
                  No encontramos productos
                  relacionados con{" "}
                  <span className="text-black font-medium">
                    "{query}"
                  </span>
                </p>

              </div>

              {relacionados.length > 0 && (
                <section>

                  <div className="flex justify-between items-center mb-6">

                    <h3 className="text-lg font-medium">
                      Estos productos podrían
                      interesarte
                    </h3>

                    <div className="hidden gap-2 md:flex">

                      <button
                        onClick={() =>
                          scroll("left")
                        }
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200"
                      >
                        <ChevronLeft
                          size={20}
                          strokeWidth={2.2}
                        />
                      </button>

                      <button
                        onClick={() =>
                          scroll("right")
                        }
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200"
                      >
                        <ChevronRight
                          size={20}
                          strokeWidth={2.2}
                        />
                      </button>

                    </div>

                  </div>

                  <div
                    ref={sliderRef}
                    className="flex gap-5 overflow-hidden"
                  >

                    {relacionados.map((p) => (
                      <div
                        key={p.id}
                        className="min-w-[220px] max-w-[220px] overflow-hidden rounded-2xl border border-black/10 bg-white"
                      >
                        <ProductCard
                          producto={p}
                        />
                      </div>
                    ))}

                  </div>

                </section>
              )}

            </div>
          )}

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">

            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-3xl border border-gray-100 bg-white animate-pulse"
                >
                  <div className="h-[280px] bg-gray-100" />

                  <div className="space-y-4 p-5">

                    <div className="h-2 w-14 rounded-full bg-gray-100" />

                    <div className="space-y-2">
                      <div className="h-4 w-[85%] rounded-full bg-gray-100" />
                      <div className="h-4 w-[60%] rounded-full bg-gray-100" />
                    </div>

                    <div className="h-5 w-20 rounded-full bg-gray-100" />

                  </div>

                </div>
              ))}

          </div>
        )}

        {!loading && currentProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6">

              {currentProducts.map((p) => (
                <div
                  key={p.id}
                  className="overflow-hidden rounded-2xl border border-black/10 bg-white"
                >
                  <ProductCard producto={p} />
                </div>
              ))}

            </div>

            {totalPages > 1 && (

  <nav className="mt-24 flex items-center justify-center">

    <div className="flex items-center gap-4 rounded-full border border-black/10 bg-white px-4 py-3">

      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="flex h-11 w-11 items-center justify-center"
      >
        <ChevronLeft
          size={20}
          strokeWidth={2.2}
        />
      </button>

      <div className="min-w-[60px] text-center text-sm font-semibold tracking-[0.2em] text-black/50">
        {page} / {totalPages}
      </div>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="flex h-11 w-11 items-center justify-center"
      >
        <ChevronRight
          size={20}
          strokeWidth={2.2}
        />
      </button>

    </div>

  </nav>

)}

          </>
        )}

      </main>

      <Footer />

    </div>
  );
};

export default Search;