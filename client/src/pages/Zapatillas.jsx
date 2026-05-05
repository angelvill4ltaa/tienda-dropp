import { useEffect, useState } from "react";
import ProductCard from "../components/productCard";
import Footer from "../components/Footer";
import { getProductos } from "../services/api";
import { ChevronDown } from "lucide-react";

const Zapatillas = () => {
  const [productos, setProductos] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [precioMax, setPrecioMax] = useState(500);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sort, setSort] = useState("default");

  const [page, setPage] = useState(1);
  const [openFilters, setOpenFilters] = useState(false);

  const perPage = 9;

  useEffect(() => {
    getProductos().then((data) => {
      const filtrados = data
        .filter((p) => p.categoria === "zapatillas")
        .map((p) => ({
          ...p,
          precio: Number(p.precio),
        }));

      setProductos(filtrados);
      setFiltered(filtrados);
    });
  }, []);

  useEffect(() => {
    let result = productos.filter((p) => p.precio <= precioMax);

    if (selectedSize) {
      result = result.filter((p) => p.tallas?.includes(selectedSize));
    }

    if (sort === "price-asc") result.sort((a, b) => a.precio - b.precio);
    if (sort === "price-desc") result.sort((a, b) => b.precio - a.precio);

    setFiltered([...result]);
    setPage(1);
  }, [precioMax, productos, selectedSize, sort]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (page - 1) * perPage;
  const currentProducts = filtered.slice(start, start + perPage);

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* HERO HEADER */}
      <section className="px-6 md:px-12 pt-14 pb-10 border-b border-gray-100 bg-white">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row justify-between md:items-end gap-8">

          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 font-semibold mb-3">
              DROPP COLLECTION
            </p>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
              Zapatillas
            </h1>

            <p className="text-sm text-gray-400 mt-3">
              {filtered.length} productos 
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={() => setOpenFilters(true)}
              className="md:hidden px-5 py-3 rounded-full border border-gray-300 bg-white text-sm font-medium"
            >
              Filtros
            </button>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none min-w-[240px] px-6 pr-12 py-3 rounded-full border border-gray-300 bg-white text-sm font-medium text-black outline-none cursor-pointer shadow-sm"
              >
                <option value="default">Ordenar productos</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
              </select>

              <ChevronDown
                size={16}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="flex flex-grow max-w-[1500px] mx-auto w-full">

        {/* SIDEBAR */}
        <aside className="w-72 hidden md:block py-12 pr-10">
          <div className="sticky top-24 rounded-[30px] border border-gray-100 p-7 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.03)]">

            <h2 className="text-sm uppercase tracking-[0.20em] text-gray-400 font-semibold mb-8">
              Filtros
            </h2>

            <div className="mb-10">
              <p className="text-sm font-semibold mb-4">Precio máximo</p>

              <input
                type="range"
                min="0"
                max="500"
                value={precioMax}
                onChange={(e) => setPrecioMax(Number(e.target.value))}
                className="w-full accent-black"
              />

              <p className="text-sm text-gray-500 mt-3">
                Hasta <span className="font-bold text-black">S/ {precioMax}</span>
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold mb-4">Talla</p>

              <div className="flex flex-wrap gap-2">
                {[40, 41, 42, 43, 44].map((size) => (
                  <button
                    key={size}
                    onClick={() =>
                      setSelectedSize(selectedSize === size ? null : size)
                    }
                    className={`w-11 h-11 rounded-full text-sm font-medium border transition
                    ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "border-gray-300 bg-white hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* MOBILE FILTER */}
        {openFilters && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-end md:hidden">
            <div className="w-80 h-full bg-white p-6 overflow-y-auto">

              <div className="flex justify-between items-center mb-8">
                <h2 className="font-bold text-lg">Filtros</h2>
                <button onClick={() => setOpenFilters(false)}>✕</button>
              </div>

              <div className="mb-8">
                <p className="text-sm font-semibold mb-3">Precio máximo</p>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={precioMax}
                  onChange={(e) => setPrecioMax(Number(e.target.value))}
                  className="w-full accent-black"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Hasta <span className="font-bold text-black">S/ {precioMax}</span>
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold mb-3">Talla</p>
                <div className="flex flex-wrap gap-2">
                  {[40, 41, 42, 43, 44].map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        setSelectedSize(selectedSize === size ? null : size)
                      }
                      className={`w-11 h-11 rounded-full text-sm font-medium border
                      ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCT GRID */}
        <div className="flex-1 py-14 px-6 md:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">

            {currentProducts.length === 0 && (
              <p className="col-span-full text-center text-sm text-gray-500 py-20">
                No se encontraron productos
              </p>
            )}

            {currentProducts.map((p) => (
              <div key={p.id}>
                <ProductCard producto={p} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-24 gap-3 flex-wrap">

              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="w-11 h-11 rounded-full border border-gray-300 bg-white disabled:opacity-30 hover:border-black transition"
              >
                ←
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-11 h-11 rounded-full text-sm font-medium transition
                  ${
                    page === i + 1
                      ? "bg-black text-white"
                      : "border border-gray-300 bg-white hover:border-black"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="w-11 h-11 rounded-full border border-gray-300 bg-white disabled:opacity-30 hover:border-black transition"
              >
                →
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Zapatillas;