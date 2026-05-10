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

          <div className="w-[76%] h-[76%] flex items-center justify-center">
            <img
              src={`/assets/${producto.imagen}`}
              alt={producto.nombre}
              className="w-full h-full object-contain group-hover:scale-[1.035] transition-transform duration-700"
            />
          </div>

          <span className="absolute top-4 left-4 bg-black text-white text-[9px] font-semibold px-3 py-1 rounded-full tracking-[0.20em]">
            Nuevo
          </span>
        </div>

        <div className="px-5 pb-6 pt-4">

          <p className="text-[10px] uppercase tracking-[0.24em] text-gray-400 font-semibold mb-2">
            DROPP
          </p>

          <h3 className="font-medium text-[16px] leading-snug line-clamp-2 min-h-[30px] text-gray-800">
            {producto.nombre}
          </h3>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-[20px] font-black  tracking-tight">
              S/ {producto.precio}
            </p>

            <span className="text-[11px] text-gray-500 font-medium">
              Disponible
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;