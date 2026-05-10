import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/productCard";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";
import { getProductos } from "../services/api";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [current, setCurrent] = useState(0);

  const navigate = useNavigate();

  const images = [
    "https://i.pinimg.com/1200x/09/ba/02/09ba02c51d9ce260bb5acceb54d4c38f.jpg",
    "https://i.pinimg.com/1200x/0b/09/de/0b09deb222604295dea07401766408b8.jpg",
    "https://i.pinimg.com/736x/b5/65/7e/b5657e5d7ae3a91f9a45f36d444c23c1.jpg",
  ];

  const categories = [
    {
      name: "Zapatillas",
      img: "https://i.pinimg.com/736x/26/55/30/2655300d0ff3a733db0e5614a949ddde.jpg",
      url: "/zapatillas",
    },
    {
      name: "Ropa",
      img: "https://i.pinimg.com/736x/b4/c9/88/b4c98855bf6f66434bec7670eaf51f8c.jpg",
      url: "/ropa",
    },
    {
      name: "Accesorios",
      img: "https://i.pinimg.com/736x/1c/f7/28/1cf7289e21823d34ca48b1b5d7836272.jpg",
      url: "/accesorios",
    },
  ];

  useEffect(() => {
    getProductos().then(setProductos);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="flex flex-col flex-grow bg-white">

      <section className="relative min-h-screen w-full overflow-hidden bg-black">

        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="hero"
            className={`absolute inset-0 w-full h-full object-cover object-center
            transition-all duration-[3000ms] ease-out
            ${
              index === current
                ? "opacity-100 scale-105"
                : "opacity-0 scale-100"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-black/55"></div>

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20"></div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>

        <div className="relative z-10 flex items-center min-h-screen px-6 md:px-14">

          <div className="max-w-4xl pt-20">

            <div className="flex items-center gap-4 mb-8">

              <span className="text-[11px] tracking-[0.5em] uppercase text-white/50 font-medium">
                COLLECTION 2026
              </span>

            </div>

            <h1 className="text-[58px] md:text-[120px] lg:text-[145px] leading-[0.88] font-black tracking-[-0.08em] uppercase text-white max-w-6xl">

              Tu presencia <br />

              <span className="text-white/30">
                empieza aqui.
              </span>

            </h1>

            <p className="mt-10 text-white/60 text-base md:text-xl leading-relaxed max-w-2xl font-medium">

              Piezas limitadas, diseño urbano y actitud en cada detalle.

            </p>

            <div className="mt-12 flex flex-wrap gap-4">

              <button
                onClick={() => navigate("/zapatillas")}
                className="h-14 px-9 rounded-full bg-white text-black text-sm font-semibold tracking-wide hover:bg-neutral-200 transition-all duration-300"
              >
                Comprar ahora
              </button>

              <button
                onClick={() => navigate("/ropa")}
                className="h-14 px-9 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-xl text-white text-sm font-medium hover:bg-white hover:text-black transition-all duration-300"
              >
                Explorar colección
              </button>

            </div>

          </div>

        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">

          {images.map((_, i) => (
            <div
              key={i}
              className={`h-[3px] rounded-full transition-all duration-500 ${
                i === current
                  ? "w-16 bg-white"
                  : "w-7 bg-white/25"
              }`}
            />
          ))}

        </div>

      </section>

      <main className="flex-grow">

        <section className="px-6 md:px-12 py-16 bg-white">

          <div className="max-w-7xl mx-auto">
            <FeaturedProducts productos={productos} />
          </div>

        </section>

        <section className="relative px-6 md:px-12 py-24 bg-gray-100 overflow-hidden">

          <div className="relative max-w-7xl mx-auto">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">

              <h2 className="text-[52px] md:text-[76px] leading-none font-black tracking-[-0.05em] text-black">
                Explora tu <br />
                próximo fit.
              </h2>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {categories.map((cat, i) => (
                <div
                  key={i}
                  onClick={() => navigate(cat.url)}
                  className="group relative h-[460px] rounded-[40px] overflow-hidden cursor-pointer bg-black"
                >

                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-[1800ms] ease-out"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 w-full p-8 z-20">

                    <div className="overflow-hidden">

                      <h3 className="text-white text-[40px] font-black tracking-[-0.05em]">
                        {cat.name}
                      </h3>

                    </div>

                    <div className="flex items-center justify-between mt-4">

                      <div className="flex items-center gap-3 text-white/70 text-sm font-medium group-hover:text-white transition duration-300">
                        Ver Coleccion →
                      </div>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>

        </section>

        <section className="relative px-6 md:px-12 py-28 bg-white overflow-hidden">

          <div className="absolute inset-0 pointer-events-none">

            <div className="absolute top-[-120px] left-[-80px] w-[320px] h-[320px] bg-black/[0.03] rounded-full blur-3xl"></div>

            <div className="absolute bottom-[-120px] right-[-80px] w-[380px] h-[380px] bg-black/[0.04] rounded-full blur-3xl"></div>

          </div>

          <div className="relative max-w-6xl mx-auto text-center">

            <div className="inline-flex items-center gap-3 mb-8">

              <div className="w-10 h-[1px] bg-black"></div>

              <p className="text-[11px] tracking-[0.45em] uppercase text-gray-400 font-medium">
                Nuestra esencia
              </p>

              <div className="w-10 h-[1px] bg-black"></div>

            </div>

            <h2 className="text-[48px] md:text-[78px] leading-[0.95] font-black tracking-[-0.06em] uppercase text-black max-w-5xl mx-auto">

              No vendemos <br />

              <span className="text-gray-300">
                prendas.
              </span>

              <br />

              Vendemos presencia.

            </h2>

          </div>

        </section>

        <section className="relative h-[620px] overflow-hidden bg-black">

          <img
            src="https://i.pinimg.com/736x/d7/38/50/d738503554ce112dc4100d7c13876d84.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-[4000ms] ease-out"
          />

          <div className="absolute inset-0 bg-black/55"></div>

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20"></div>

          <div className="relative z-10 h-full flex items-center px-6 md:px-16">

            <div className="max-w-3xl">

              <h2 className="text-[58px] md:text-[120px] leading-[0.9] font-black tracking-[-0.08em] uppercase text-white">

                Edición <br />

                <span className="text-white/30">
                  limitada
                </span>

              </h2>

              <p className="mt-8 text-white/70 text-base md:text-xl leading-relaxed max-w-2xl font-medium">

                Diseños exclusivos creados para quienes no quieren verse como todos.

              </p>

              <div className="mt-10 flex flex-wrap gap-4">

                <button
                  onClick={() => navigate("/zapatillas")}
                  className="h-14 px-9 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-white text-sm font-medium hover:bg-white hover:text-black transition-all duration-300"
                >
                  Ver colección
                </button>

              </div>

            </div>

          </div>

          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>

        </section>

        <section className="relative px-6 md:px-12 py-24 bg-[#f3f3f3] overflow-hidden">

          <div className="absolute top-0 left-[-120px] w-[320px] h-[320px] bg-black/[0.03] rounded-full blur-3xl"></div>

          <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-black/[0.04] rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto">

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">

              <div>

                <h2 className="text-[42px] md:text-[72px] leading-[0.92] font-black tracking-[-0.06em] uppercase text-black">
                  Nuevos <br />
                  Ingresos
                </h2>

              </div>

              <button
                onClick={() => navigate("/zapatillas")}
                className="group w-fit h-14 px-8 rounded-full bg-black text-white text-sm font-semibold tracking-wide hover:bg-neutral-800 transition-all duration-300"
              >

                <span className="flex items-center gap-3">

                  Ver todo

                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>

                </span>

              </button>

            </div>

            <div className="flex gap-7 overflow-x-auto pb-4 scrollbar-hide">

              {productos.slice(0, 8).map((p) => (
                <div
                  key={p.id}
                  className="min-w-[290px] max-w-[290px] group transition-all duration-500 hover:-translate-y-2"
                >

                  <div className="relative">

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] blur-2xl rounded-[32px] transition-all duration-500"></div>

                    <div className="relative">
                      <ProductCard producto={p} />
                    </div>

                  </div>

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