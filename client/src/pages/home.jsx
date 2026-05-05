import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/productCard";
import { getProductos } from "../services/api";
import Footer from "../components/Footer";
import FeaturedProducts from "../components/FeaturedProducts";
import { Truck, ShieldCheck, BadgeCheck } from "lucide-react";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const images = [
    "https://i.pinimg.com/736x/d2/a8/43/d2a843f34db1f1b14dce71a37ddceb93.jpg",
    "https://i.pinimg.com/736x/b9/eb/54/b9eb542f8fb50377d2cd493be49dc50e.jpg",
    "https://i.pinimg.com/1200x/58/5f/00/585f002a140301f18d4ae5e2e06785af.jpg",
    "https://i.pinimg.com/1200x/ab/d4/a5/abd4a587fe158f38a1e8cc3d21522a2a.jpg"
  ];

  useEffect(() => {
    getProductos().then(setProductos);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const categories = [
    {
      name: "Zapatillas",
      img: "https://i.pinimg.com/736x/fe/d0/ed/fed0ed7e0a966681ffc39c05e3349457.jpg",
      url: "/zapatillas"
    },
    {
      name: "Ropa",
      img: "https://i.pinimg.com/736x/b4/c9/88/b4c98855bf6f66434bec7670eaf51f8c.jpg",
      url: "/ropa"
    },
    {
      name: "Accesorios",
      img: "https://i.pinimg.com/736x/1c/f7/28/1cf7289e21823d34ca48b1b5d7836272.jpg",
      url: "/accesorios"
    }
  ];

  return (
    <div className="flex flex-col flex-grow">

      {/* HERO */}
      <section className="relative min-h-[88vh] w-full overflow-hidden">

        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="hero"
            className={`absolute inset-0 w-full h-full object-cover object-[center_20%]
            transition-all duration-[2200ms] ease-out
            ${index === current ? "opacity-100 scale-105" : "opacity-0 scale-100"}`}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/20"></div>

        <div className="relative z-10 flex items-center min-h-[88vh] px-6 md:px-16">
          <div className="max-w-2xl text-white">

            <p className="text-[11px] tracking-[0.45em] text-gray-400 mb-5 uppercase">
              Colección exclusiva 2026
            </p>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
              Eleva tu estilo <br />
              <span className="text-gray-300">sin esfuerzo</span>
            </h1>

            <p className="mt-6 text-lg text-gray-300 max-w-xl leading-relaxed">
              Diseños seleccionados para quienes entienden que vestir bien no es opcional.
            </p>

            <div className="mt-10 flex gap-4 flex-wrap">

              <button
                onClick={() => navigate("/zapatillas")}
                className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:scale-105 hover:bg-gray-100 transition"
              >
                Comprar ahora
              </button>

              <button
                onClick={() => navigate("/ropa")}
                className="border border-white/40 px-8 py-3 rounded-full hover:bg-white hover:text-black transition backdrop-blur-sm"
              >
                Explorar colección
              </button>

            </div>

          </div>
        </div>

        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                i === current ? "w-10 bg-white" : "w-6 bg-white/40"
              }`}
            />
          ))}
        </div>
      </section>

      <main className="flex-grow">

        {/* TRUST STRIP */}
        <section className="bg-black text-white py-10">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">

            <div className="flex items-center justify-center gap-4">
              <Truck size={22} />
              <div>
                <h3 className="font-semibold text-sm">Envíos rápidos</h3>
                <p className="text-gray-400 text-xs">24-72h a nivel nacional</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <ShieldCheck size={22} />
              <div>
                <h3 className="font-semibold text-sm">Pago seguro</h3>
                <p className="text-gray-400 text-xs">Yape, Plin y tarjetas</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <BadgeCheck size={22} />
              <div>
                <h3 className="font-semibold text-sm">Garantía real</h3>
                <p className="text-gray-400 text-xs">Cambios y devoluciones</p>
              </div>
            </div>

          </div>
        </section>

        {/* DESTACADOS */}
        <section className="px-6 md:px-12 py-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <FeaturedProducts productos={productos} />
          </div>
        </section>

        {/* CATEGORIAS */}
        <section className="px-6 md:px-12 py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto">

            <h2 className="text-4xl font-bold mb-3 text-center">
              Explora por categoría
            </h2>

            <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">
              Encuentra piezas seleccionadas para cada ocasión
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {categories.map((cat, i) => (
                <div
                  key={i}
                  onClick={() => navigate(cat.url)}
                  className="relative h-80 md:h-[370px] rounded-[30px] overflow-hidden cursor-pointer group shadow-xl"
                >
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  <div className="absolute bottom-8 left-8">
                    <h3 className="text-white text-3xl font-bold">
                      {cat.name}
                    </h3>
                    <p className="text-gray-300 text-sm mt-1 tracking-wide">
                      Comprar ahora →
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MID BANNER */}
        <section className="relative h-[420px] flex items-center justify-center overflow-hidden">
          <img
            src="https://i.pinimg.com/736x/d7/38/50/d738503554ce112dc4100d7c13876d84.jpg"
            className="absolute w-full h-full object-cover"
            alt=""
          />

          <div className="absolute inset-0 bg-black/65"></div>

          <div className="relative z-10 text-center text-white px-6">

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Nueva Colección 2026
            </h2>

            <p className="text-gray-300 mb-7 max-w-xl mx-auto">
              Diseños creados para destacar en cualquier escenario.
            </p>

            <button
              onClick={() => navigate("/ropa")}
              className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition"
            >
              Explorar ahora
            </button>
          </div>
        </section>

        {/* NUEVOS INGRESOS */}
        <section className="px-6 md:px-12 py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto">

            <div className="flex justify-between items-center mb-10 flex-wrap gap-3">
              <h2 className="text-3xl font-bold">
                Recién llegados
              </h2>

              <button
                onClick={() => navigate("/zapatillas")}
                className="text-sm font-medium text-gray-500 hover:text-black transition"
              >
                Ver todos los productos →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
              {productos.slice(0, 8).map((p) => (
                <div
                  key={p.id}
                  className="hover:scale-[1.03] transition duration-300"
                >
                  <ProductCard producto={p} />
                </div>
              ))}
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Home;