import { useNavigate } from "react-router-dom";

const ProductCard = ({ producto }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/producto/${producto.id}`)}
      className="group overflow-hidden rounded-3xl border border-gray-100"
    >

        <div className="relative flex h-72 items-center justify-center overflow-hidden bg-gray-50">

          <div className="h-[76%] w-[76%]">
            <img
              src={`/assets/${producto.imagen}`}
              alt={producto.nombre}
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.035]"
            />
          </div>

          <span className="absolute top-4 left-4 bg-black px-3 py-1 text-white text-[9px] font-semibold rounded-full tracking-[0.18em]">
            Nuevo
          </span>
        </div>

        <div className="px-5 pb-6 pt-4">

          <p className="text-[10px] uppercase tracking-[0.24em] text-gray-400 font-semibold mb-2">
            DROPP
          </p>

          <h3 className="line-clamp-2 text-[16px] font-medium text-gray-800">
            {producto.nombre}
          </h3>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-[20px] font-medium">
              S/ {producto.precio}
            </p>

            <span className="text-[11px] text-gray-500 font-medium">
              Disponible
            </span>
          </div>
        </div>
    </div>
  );
};

export default ProductCard;