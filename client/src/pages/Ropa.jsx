import { useEffect, useState } from "react";
import ProductCard from "../components/productCard";
import Footer from "../components/Footer";
import { getProductos } from "../services/api";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"; 

const Ropa = () => {
  const [productos, setProductos] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [precioMax, setPrecioMax] = useState(500);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sort, setSort] = useState("default");

  const [page, setPage] = useState(1);
  const [openFilters, setOpenFilters] = useState(false);

  const perPage = 18;
  const sizes = ["S", "M", "L", "XL"];

  useEffect(() => {
    const fetchProductos = async () => {
      const data = await getProductos();

      const filtrados = data
        .filter((p) => p.categoria === "ropa")
        .map((p) => ({
          ...p,
          precio: Number(p.precio),
        }));

      setProductos(filtrados);
      setFiltered(filtrados);
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    let result = productos.filter((p) => p.precio <= precioMax);

    if (selectedSize) {
      result = result.filter((p) =>
        p.tallas?.includes(String(selectedSize))
      );
    }

    if (sort === "price-asc") {
      result = [...result].sort((a, b) => a.precio - b.precio);
    } else if (sort === "price-desc") { 
      result = [...result].sort((a, b) => b.precio - a.precio);
    }

    setFiltered(result);
    setPage(1);
  }, [precioMax, productos, selectedSize, sort]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (page - 1) * perPage;
  const currentProducts = filtered.slice(start, start + perPage);

  return (
    <div className="min-h-screen flex flex-col">

      <section className="w-full border-b">

        <div className="max-w-[1700px] mx-auto px-5 md:px-16 pt-5 pb-4">

          <div className="flex justify-between items-center">

              <h1 className="text-[34px] md:text-[42px] leading-none font-bold">
                  Ropa ({filtered.length})
              </h1>

            <div className="flex items-center gap-3">

              <button
                onClick={() => setOpenFilters(true)}
                className="h-11 px-5 rounded-full border border-black/10 bg-white text-sm font-medium"
              >
                Filtros
              </button>

              <div className="relative">

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none h-11 px-5 pr-11 rounded-full border border-black/10 bg-white text-sm font-medium outline-none cursor-pointer"
                >
                  <option value="default">
                    Ordenar por
                  </option>

                  <option value="price-asc">
                    Precio: menor a mayor
                  </option>

                  <option value="price-desc">
                    Precio: mayor a menor
                  </option>

                </select>

                <ChevronDown
                  size={15}
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      <main className="w-full max-w-[1700px] mx-auto px-8 md:px-24 pt-6 pb-24">

        {openFilters && (
          <div className="fixed inset-0 z-50 bg-black/20">

            <div className="ml-auto w-[380px] h-full bg-gray-100 p-7 overflow-y-auto">

              <div className="flex items-center justify-between mb-10">

                <h2 className="text-[26px] font-bold">
                  Filtros
                </h2>

                <button
                  onClick={() => setOpenFilters(false)}
                  className="size-11 rounded-full border border-black/10 bg-white text-lg"
                >
                  ✕
                </button>

              </div>

              <div className="border-b border-black/10 pb-10 mb-10">

                <div className="flex items-center justify-between mb-5">

                  <p className="text-[18px] font-semibold">
                    Precio
                  </p>

                  <span className="text-[13px] font-semibold px-3 py-1 rounded-full bg-gray-200">
                    S/ {precioMax}
                  </span>

                </div>

                <input
                  type="range"
                  min="0"
                  max="500"
                  value={precioMax}
                  onChange={(e) =>
                    setPrecioMax(Number(e.target.value))
                  }
                  className="w-full accent-black cursor-pointer"
                />

              </div>

              <div>

                  <p className="text-[18px] font-semibold mb-2">
                    Talla
                  </p>

                <div className="flex flex-wrap gap-3">

                  {sizes.map((size) => (

                    <button
                      key={size}
                      onClick={() =>
                        setSelectedSize(
                          selectedSize === size ? null : size
                        )
                      }
                      className={`size-12 rounded-full border text-sm font-medium 
                      ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white border-black/10"
                      }
                      `}
                    >
                      {size}
                    </button>
                  ))}

                </div>

              </div>

            </div>

          </div>
        )}

        <section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

            {currentProducts.length === 0 && (
              <div className="col-span-full py-32 text-center">

                <p className="text-[15px] text-black/40 font-medium">
                  No hay productos disponibles
                </p>

              </div>
            )}

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

        </section>

      </main>

      <Footer />

    </div>
  );
};

export default Ropa;