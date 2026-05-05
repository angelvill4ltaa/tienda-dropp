import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import ProductCard from "../components/productCard";
import Footer from "../components/Footer";
import { getProductos } from "../services/api";

const Accesorios = () => {
  const [productos, setProductos] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [precioMax, setPrecioMax] = useState(500);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  const [page, setPage] = useState(1);
  const [openFilters, setOpenFilters] = useState(false);

  const perPage = 8;

  useEffect(() => {
    getProductos().then((data) => {
      const filtrados = data
        .filter(p => p.categoria === "accesorios")
        .map(p => ({
          ...p,
          precio: Number(p.precio)
        }));

      setProductos(filtrados);
      setFiltered(filtrados);
    });
  }, []);

  useEffect(() => {
    let result = productos.filter(p => p.precio <= precioMax);

    if (search) {
      result = result.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "price-asc") result.sort((a, b) => a.precio - b.precio);
    if (sort === "price-desc") result.sort((a, b) => b.precio - a.precio);

    setFiltered([...result]);
    setPage(1);
  }, [precioMax, search, productos, sort]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (page - 1) * perPage;
  const currentProducts = filtered.slice(start, start + perPage);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* HEADER */}
      <section className="bg-white border-b px-6 md:px-12 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4 md:items-center">

          <div>
            <h1 className="text-4xl font-extrabold">Accesorios</h1>
            <p className="text-gray-500 text-sm">
              {filtered.length} productos
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">

            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 md:w-64 border rounded-full px-4 py-2 focus:ring-2 focus:ring-black outline-none"
            />

            <button
              onClick={() => setOpenFilters(true)}
              className="md:hidden px-4 py-2 border rounded-full"
            >
              Filtros
            </button>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-full px-4 py-2 text-sm"
            >
              <option value="default">Ordenar</option>
              <option value="price-asc">Precio ↑</option>
              <option value="price-desc">Precio ↓</option>
            </select>

          </div>
        </div>
      </section>

      <main className="flex flex-grow">

        {/* SIDEBAR */}
        <aside className="w-72 bg-white p-6 border-r hidden md:block sticky top-0 h-screen">

          <h2 className="font-bold mb-6">Filtros</h2>

          <div className="mb-8">
            <p className="font-medium mb-2">Precio</p>
            <input
              type="range"
              min="0"
              max="500"
              value={precioMax}
              onChange={(e) => setPrecioMax(Number(e.target.value))}
              className="w-full accent-black"
            />
            <p className="text-sm text-gray-500">
              Hasta ${precioMax}
            </p>
          </div>

          <button
            onClick={() => {
              setPrecioMax(500);
              setSearch("");
              setSort("default");
            }}
            className="text-sm text-gray-500 hover:text-black"
          >
            Limpiar filtros
          </button>

        </aside>

        {/* PRODUCTOS */}
        <div className="flex-1 px-6 md:px-12 py-10">

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

            {currentProducts.length === 0 && (
              <p className="col-span-full text-center text-gray-500">
                No se encontraron productos
              </p>
            )}

            {currentProducts.map((p) => (
              <div
                key={p.id}
                className="hover:-translate-y-2 transition duration-300"
              >
                <ProductCard producto={p} />
              </div>
            ))}

          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-2">

              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border rounded-lg"
              >
                ←
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    page === i + 1
                      ? "bg-black text-white"
                      : "border"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border rounded-lg"
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

export default Accesorios;