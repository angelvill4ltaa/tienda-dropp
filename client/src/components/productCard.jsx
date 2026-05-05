import { useNavigate } from "react-router-dom";

const ProductCard = ({ producto }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/producto/${producto.id}`)}
      className="cursor-pointer group"
    >
      <div className="rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-[0_10px_28px_rgba(0,0,0,0.045)] hover:shadow-[0_16px_38px_rgba(0,0,0,0.07)] transition duration-300">

        <div className="relative h-72 bg-[#fafafa] flex items-center justify-center overflow-hidden">

          <div className="w-[78%] h-[78%] flex items-center justify-center">
            <img
              src={`/assets/${producto.imagen}`}
              alt={producto.nombre}
              className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
            />
          </div>

          <span className="absolute top-4 left-4 bg-black text-white text-[9px] font-semibold px-3 py-1 rounded-full tracking-[0.20em]">
            Nuevo
          </span>
        </div>

        <div className="px-5 pb-6 pt-4">

          <p className="text-[10px] uppercase tracking-[0.28em] text-gray-400 font-semibold mb-2">
            DROPP
          </p>

          <h3 className="font-medium text-[14px] leading-snug line-clamp-2 min-h-[42px] text-gray-800">
            {producto.nombre}
          </h3>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-black font-black text-[23px] tracking-tight">
              S/ {producto.precio}
            </p>

            <span className="text-[11px] text-gray-400">
              Disponible
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;