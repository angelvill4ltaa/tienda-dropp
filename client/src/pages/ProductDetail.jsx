import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getProductoById, getProductos } from "../services/api";
import { useStore } from "../context/StoreContext";
import Footer from "../components/Footer";
import ProductCard from "../components/productCard";
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, BadgeCheck } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const { agregarAlCarrito } = useStore();

  const [producto, setProducto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [errorSize, setErrorSize] = useState(false);
  const [added, setAdded] = useState(false);

  const sliderRef = useRef(null);

  useEffect(() => {
    setLoading(true);

    Promise.all([getProductoById(id), getProductos()])
      .then(([prod, all]) => {
        if (!prod) {
          setError(true);
          return;
        }

        setProducto(prod);
        setSelectedImage(prod.imagen);

        const relacionadosFiltrados = all
          .filter((p) => p.categoria === prod.categoria && p.id !== prod.id)
          .slice(0, 6);

        setRelacionados(relacionadosFiltrados);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize && producto.tallas?.length > 0) {
      setErrorSize(true);
      return;
    }

    setErrorSize(false);

    agregarAlCarrito({
      ...producto,
      size: selectedSize,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const scroll = (dir) => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto">

          {loading && (
            <div className="animate-pulse grid md:grid-cols-2 gap-20">
              <div className="h-[620px] bg-gray-100 rounded-[32px]"></div>
              <div className="space-y-5">
                <div className="h-6 bg-gray-100 w-2/3 rounded"></div>
                <div className="h-5 bg-gray-100 w-full rounded"></div>
                <div className="h-14 bg-gray-100 w-1/2 rounded-full"></div>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-24">
              <h2 className="text-2xl font-semibold">Producto no disponible</h2>
            </div>
          )}

          {!loading && !error && producto && (
            <>
              <div className="grid md:grid-cols-2 gap-20 lg:gap-28">

                {/* IMAGEN */}
                <div>
                  <div className="relative rounded-[34px] overflow-hidden border border-gray-100 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
                    <img
                      src={`/assets/${selectedImage}`}
                      alt={producto.nombre}
                      className="w-full h-[640px] object-contain p-14"
                    />

                    <span className="absolute top-6 left-6 bg-black text-white text-[11px] px-4 py-1.5 rounded-full tracking-[0.18em]">
                      Nuevo
                    </span>
                  </div>

                  <div className="flex gap-3 mt-5">
                    {[producto.imagen].map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedImage(img)}
                        className={`w-20 h-20 rounded-2xl cursor-pointer border bg-white p-2 flex items-center justify-center transition
                        ${
                          selectedImage === img
                            ? "border-black"
                            : "border-gray-200 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={`/assets/${img}`}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* INFO */}
                <div className="pt-2">

                  <p className="text-[11px] uppercase tracking-[0.24em] text-gray-400 font-semibold mb-4">
                    DROPP 
                  </p>

                  <h1 className="text-4xl md:text-[48px] font-black tracking-tight leading-tight mb-4">
                    {producto.nombre}
                  </h1>

                  <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-lg">
                    Producto original
                  </p>

                  <div className="flex items-end gap-4 mb-10">
                    <p className="text-4xl font-black tracking-tight">
                      S/ {producto.precio}
                    </p>

                    <span className="text-sm text-green-600 font-medium mb-1">
                      En stock
                    </span>
                  </div>

                  {producto.tallas?.length > 0 && (
                    <div className="mb-10">
                      <div className="flex justify-between mb-4">
                        <span className="text-sm font-semibold">Selecciona tu talla</span>
                        <span className="text-sm text-gray-400 hover:text-black cursor-pointer">
                          Guía de tallas
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        {producto.tallas.map((size) => (
                          <button
                            key={size}
                            onClick={() => {
                              setSelectedSize(size);
                              setErrorSize(false);
                            }}
                            className={`h-12 rounded-full text-sm font-medium border transition
                            ${
                              selectedSize === size
                                ? "bg-black text-white border-black"
                                : "border-gray-300 hover:border-black"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>

                      {errorSize && (
                        <p className="text-xs text-red-500 mt-3">
                          Selecciona una talla
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-black text-white py-4 rounded-full font-semibold tracking-wide hover:bg-gray-900 transition"
                  >
                    {added ? "Producto agregado ✓" : "Agregar al carrito"}
                  </button>

                 <div className="mt-5 gap-2 px-4 py-2 text-sm text-gray-700">
                   🚚 Delivery gratis por compras desde <span className="font-semibold text-black">S/500</span>
                 </div>

                  {/* BENEFICIOS */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">

                    <div className="border border-gray-200 rounded-2xl px-4 py-4 flex items-center gap-3">
                      <Truck size={18} />
                      <div>
                        <p className="text-xs font-semibold text-black">Envío rápido</p>
                        <p className="text-[11px] text-gray-500">Todo el Perú</p>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-2xl px-4 py-4 flex items-center gap-3">
                      <ShieldCheck size={18} />
                      <div>
                        <p className="text-xs font-semibold text-black">Pago seguro</p>
                        <p className="text-[11px] text-gray-500">Yape / Tarjeta</p>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-2xl px-4 py-4 flex items-center gap-3">
                      <BadgeCheck size={18} />
                      <div>
                        <p className="text-xs font-semibold text-black">Garantía</p>
                        <p className="text-[11px] text-gray-500">Producto original</p>
                      </div>
                    </div>

                  </div>

                  {/* DESCRIPCION */}
                  <div className="mt-12 border-t border-gray-100 pt-8">
                    <h3 className="font-semibold text-black mb-4">
                      Descripción del producto
                    </h3>

                    <p className="text-sm text-gray-600 leading-7">
                      {producto.descripcion}
                    </p>

                    <ul className="mt-5 space-y-2 text-sm text-gray-500">
                      <li>• Diseño urbano y contemporáneo</li>
                      <li>• Construcción resistente para uso diario</li>
                      <li>• Comodidad superior y acabados premium</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* RELACIONADOS */}
              {relacionados.length > 0 && (
                <section className="mt-28">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">También te puede interesar</h2>

                    <div className="flex gap-2">
                      <button
                        onClick={() => scroll("left")}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <button
                        onClick={() => scroll("right")}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>

                  <div
                    ref={sliderRef}
                    className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar"
                  >
                    {relacionados.map((p) => (
                      <div key={p.id} className="min-w-[270px]">
                        <ProductCard producto={p} />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;