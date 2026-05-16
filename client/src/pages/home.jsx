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
  }, []);

  return (
    <div className="bg-white">

      <section className="relative min-h-screen overflow-hidden bg-black">

        {images.map((img, index) => (
          <img
            key={img}
            src={img}
            alt="hero"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[4000ms] ease-out
            ${
              index === current
                ? "opacity-100 scale-105"
                : "opacity-0 scale-100"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-black/30"/>

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />

        <div className="relative z-10 flex items-end min-h-screen pb-16 md:pb-24 px-6 md:px-14">

          <div className="max-w-3xl">

              <span className="mb-5 block text-[11px] tracking-[0.38em] uppercase text-white/50 font-medium">
                COLLECTION 2026
              </span>           

            <h1 className="text-[52px] md:text-[84px] lg:text-[110px] leading-[0.88] font-black tracking-[-0.05em] uppercase text-white max-w-4xl">

              Diseñado <br />

              <span className="text-white/40">
                para destacar.
              </span>

            </h1>

            <p className="mt-10 text-white/60 text-base md:text-xl leading-relaxed max-w-2xl font-medium">
              Colección limitada de inspiración urbana.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <button
                onClick={() => navigate("/zapatillas")}
                className="h-14 px-8 rounded-2xl bg-white text-black text-sm font-semibold tracking-wide hover:bg-white/90 transition-all duration-300"
              >
                Comprar ahora
              </button>

              <button
                onClick={() => navigate("/ropa")}
                className="h-14 px-8 rounded-2xl border border-white/10 text-white text-sm font-medium hover:bg-white hover:text-black transition-all duration-300"
              >
                Explorar colección
              </button>

            </div>

          </div>

        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">

          {images.map((_, i) => (
            <div
              key={i}
              className={`h-[3px] rounded-full transition-all duration-500 ${
                i === current
                  ? "w-12 bg-white"
                  : "w-7 bg-white/25"
              }`}
            />
          ))}

        </div>

      </section>

      <main>

        <section className="px-6 md:px-12">

          <div className="max-w-7xl mx-auto">
            <FeaturedProducts productos={productos} />
          </div>

        </section>

        <section className="relative px-6 md:px-12 py-24 bg-gray-100 overflow-hidden">

          <div className="max-w-7xl mx-auto">

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
                  className="group relative h-[460px] rounded-[32px] overflow-hidden cursor-pointer bg-black"
                >

                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 w-full p-8 z-20">

                      <h3 className="text-white text-[40px] font-black tracking-[-0.05em]">
                        {cat.name}
                      </h3>

                      <div className="mt-2 text-sm font-medium text-white/70">
                        Explorar →
                      </div>                

                  </div>

                </div>
              ))}

            </div>

          </div>

        </section>

        <section className="relative h-[540px] md:h-[620px] overflow-hidden bg-black">

          <img
            src="https://i.pinimg.com/736x/d7/38/50/d738503554ce112dc4100d7c13876d84.jpg"
            alt=""
            className="absolute w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent"></div>

          <div className="relative z-10 flex h-full items-end px-6 pb-16 md:px-16 md:pb-20">

            <div className="max-w-3xl">

              <h2 className="text-[48px] md:text-[88px] leading-[0.9] font-black tracking-[-0.05em] uppercase text-white">
                Edición <br />
                <span className="text-white/45">limitada</span>
              </h2>

                <button
                  onClick={() => navigate("/zapatillas")}
                  className="mt-6 h-14 rounded-2xl border border-white/10 px-8 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-black"
                >
                  Ver colección
                </button>

            </div>

          </div>

          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent"></div>

        </section>

        <section className="relative px-6 md:px-12 py-24 overflow-hidden">

          <div className="max-w-7xl mx-auto">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-10">

                <h2 className="text-3xl md:text-4xl font-bold">
                  Nuevos Ingresos
                </h2>              

              <button
                onClick={() => navigate("/zapatillas")}
                className="text-sm font-semibold hover:opacity-60 transition-opacity"
              >
                  Ver todo →
              </button>

            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">

              {productos.slice(0, 8).map((p) => (
                <div key={p.id} className="min-w-[290px]">
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