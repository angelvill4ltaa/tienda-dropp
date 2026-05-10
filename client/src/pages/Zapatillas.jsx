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

  const perPage = 18;

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
      result = result.filter((p) =>
        p.tallas?.includes(String(selectedSize))
      );
    }

    if (sort === "price-asc") {
      result.sort((a, b) => a.precio - b.precio);
    } else if (sort === "price-desc") { 
      result.sort((a, b) => b.precio - a.precio);
    }

    setFiltered([...result]);
    setPage(1);
  }, [precioMax, productos, selectedSize, sort]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (page - 1) * perPage;
  const currentProducts = filtered.slice(start, start + perPage);

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col overflow-hidden">

      {/* TOP BAR */}
      <section className="w-full border-b border-black/[0.06] bg-[#f5f5f0]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.03)]">

        <div className="max-w-[1700px] mx-auto px-5 md:px-16 pt-5 pb-4">

          <div className="flex items-start justify-between gap-6">

            {/* LEFT */}
              <h1 className="text-[34px] md:text-[42px] leading-none font-bold tracking-[-0.08em] text-black">
                Zapatillas
                <span className="ml-2 text-black/35">
                  ({filtered.length})
                </span>
              </h1>

            {/* RIGHT */}
            <div className="flex items-center gap-4 pt-1">

              {/* FILTER BUTTON */}
              <button
                onClick={() => setOpenFilters(true)}
                className="h-11 px-5 rounded-full border border-black/[0.07] bg-white/90 backdrop-blur-xl text-[14px] font-medium text-black shadow-[0_10px_30px_rgba(0,0,0,0.04)]       
                hover:border-black/20 hover:shadow-[0_14px_40px_rgba(0,0,0,0.06)] hover:-translate-y-[2px] transition-all duration-500"
              >
                Filtros
              </button>

              {/* SORT */}
              <div className="relative">

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none h-11 px-5 pr-11 rounded-full border border-black/[0.07] bg-white/90 backdrop-blur-xl text-[14px] font-medium text-black outline-none     
                  cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:border-black/20 hover:shadow-[0_14px_40px_rgba(0,0,0,0.06)] hover:bg-white transition-all duration-500 "
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/60 pointer-events-none"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* MAIN */}
      <main className="w-full max-w-[1700px] mx-auto px-8 md:px-24 pt-6 pb-24">

        {/* FILTER PANEL */}
        {openFilters && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md">

            <div className="ml-auto w-[380px] h-full bg-[#f8f8f6] p-7 overflow-y-auto shadow-[-20px_0_60px_rgba(0,0,0,0.12)] transition-all duration-500">

              {/* HEADER */}

              <div className="flex items-center justify-between mb-10">

                <h2 className="text-[26px] font-bold tracking-[-0.06em] text-black">
                  Filtros
                </h2>

                <button
                  onClick={() => setOpenFilters(false)}
                  className="w-11 h-11 rounded-full border border-black/[0.08] bg-white text-lg hover:bg-black hover:text-white transition-all duration-500"
                >
                  ✕
                </button>

              </div>

              {/* PRICE */}
              <div className="border-b border-black/[0.06] pb-10 mb-10">

                <div className="flex items-center justify-between mb-5">

                  <p className="text-[18px] font-semibold tracking-[-0.02em] text-black">
                    Precio
                  </p>

                  <span className="text-[13px] font-semibold text-black/70 px-3 py-1 rounded-full bg-black/[0.04]">
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

              {/* SIZE */}
              <div>

                <div className="flex items-center justify-between mb-5">

                  <p className="text-[18px] font-semibold tracking-[-0.02em] text-black">
                    Talla
                  </p>

                </div>

                <div className="flex flex-wrap gap-3">

                  {["40", "41", "42", "43", "44"].map((size) => (

                    <button
                      key={size}
                      onClick={() =>
                        setSelectedSize(
                          selectedSize === size ? null : size
                        )
                      }
                      className={`w-12 h-12 rounded-full border text-sm font-medium transition-all duration-500
                      ${
                        selectedSize === size
                          ? "bg-black text-white border-black shadow-[0_10px_25px_rgba(0,0,0,0.15)] scale-[1.03]"
                          : "bg-white border-black/[0.07] hover:border-black hover:-translate-y-[2px]"
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

        {/* PRODUCTS */}
        <section>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-14">

            {currentProducts.length === 0 && (
              <div className="col-span-full py-32 text-center">

                <p className="text-[15px] text-black/40 font-medium tracking-wide">
                  No hay productos disponibles
                </p>

              </div>
            )}

            {currentProducts.map((p) => (

              <div
                key={p.id}
                className="group relative transition-all duration-500"
              >

                {/* HOVER GLOW */}
                <div className="absolute inset-0 rounded-[30px] bg-white opacity-0 scale-[0.96] blur-2xl group-hover:opacity-100 group-hover:scale-100
                  transition-all duration-700" />

                {/* CARD */}
                <div className="relative rounded-[30px] transition-all duration-700 group-hover:-translate-y-[6px]
                    group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)]
                ">

                  <div className="relative overflow-hidden rounded-[30px] bg-[#fafafa] border border-black/[0.04] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">

                    {/* LUXURY LIGHT */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700
                      pointer-events-none z-10" />

                    <div className="transition-transform duration-700 group-hover:scale-[1.015]">
                      <ProductCard producto={p} />
                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (

            <div className="flex justify-center items-center flex-wrap gap-3 mt-28">

              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="w-11 h-11 rounded-full border border-black/[0.07] bg-white/90 backdrop-blur-xl text-black text-sm font-medium
                hover:border-black hover:-translate-y-[2px] transition-all duration-500 disabled:opacity-30"
              >
                ←
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (

                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-11 h-11 rounded-full text-sm font-semibold transition-all duration-500
                  ${
                    page === i + 1
                      ? "bg-black text-white shadow-[0_10px_25px_rgba(0,0,0,0.15)]"
                      : "bg-white border border-black/[0.07] text-black hover:border-black hover:-translate-y-[2px]"
                  }
                  `}
                >
                  {i + 1}
                </button>

              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="w-11 h-11 rounded-full border border-black/[0.07] bg-white/90 backdrop-blur-xl text-black text-sm 
                font-medium hover:border-black hover:-translate-y-[2px] transition-all duration-500 disabled:opacity-30"
              >
                →
              </button>

            </div>

          )}

        </section>

      </main>

      <Footer />

    </div>
  );
};

export default Zapatillas;