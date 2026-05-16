import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";

import ProductCard from "./productCard";

const FeaturedProducts = ({ productos }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="mx-auto max-w-7xl py-16">

      <div className="mb-10 flex items-center justify-between">

        <h2 className="text-3xl font-bold md:text-4xl">
          Lo más vendido
        </h2>

        <div className="hidden gap-2 md:flex">

          <button
            ref={prevRef}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 transition hover:bg-neutral-200"
          >
            <ChevronLeft size={20} strokeWidth={2.2} />
          </button>

          <button
            ref={nextRef}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 transition hover:bg-neutral-200"
          >
            <ChevronRight size={20} strokeWidth={2.2} />
          </button>

        </div>

      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        loop
        spaceBetween={20}
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
            <ProductCard producto={p} />
          </SwiperSlide>
        ))}

      </Swiper>

    </section>
  );
};

export default FeaturedProducts;