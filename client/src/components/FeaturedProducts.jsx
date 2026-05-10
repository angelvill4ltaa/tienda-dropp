import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Navigation, Autoplay } from "swiper/modules";
import ProductCard from "./productCard";
import { useRef } from "react";

const FeaturedProducts = ({ productos }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-0 py-16 relative">

      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Lo más vendido
          </h2>
        </div>

        <div className="hidden md:flex gap-2">
          <button
            ref={prevRef}
            className="w-11 h-11 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition"
          >
            ←
          </button>
          <button
            ref={nextRef}
            className="w-11 h-11 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition"
          >
            →
          </button>
        </div>
      </div>
 
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      >
        {productos.map((p) => (
          <SwiperSlide key={p.id}>
            <div className="h-full">
              <ProductCard producto={p} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </section>
  );
};

export default FeaturedProducts;