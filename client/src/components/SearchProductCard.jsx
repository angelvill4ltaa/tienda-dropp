const SearchProductCard = ({ producto, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer group min-w-[240px] max-w-[240px]"
    >
      <div
        className="rounded-[30px] overflow-hidden bg-white border border-gray-100
        shadow-[0_10px_28px_rgba(0,0,0,0.045)]
        hover:shadow-[0_16px_38px_rgba(0,0,0,0.07)]
        transition-all duration-300"
      >

        <div
          className="relative h-[260px] bg-[#fafafa]
          flex items-center justify-center overflow-hidden"
        >

          <div className="w-[74%] h-[74%] flex items-center justify-center">
            <img
              src={`/assets/${producto.imagen}`}
              alt={producto.nombre}
              className="w-full h-full object-contain
              group-hover:scale-[1.04]
              transition-transform duration-700"
            />
          </div>

        </div>

        <div className="px-5 pb-6 pt-4">
          <h3
            className="font-medium text-[16px] leading-snug
            line-clamp-2 min-h-[42px] text-gray-800"
          >
            {producto.nombre}
          </h3>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-[20px] font-medium tracking-tight">
              S/ {producto.precio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProductCard;