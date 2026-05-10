import { useStore } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

const Cart = () => {
  const {
    carrito,
    openCart,
    setOpenCart,
    eliminarDelCarrito,
    actualizarCantidad,
  } = useStore();

  const navigate = useNavigate();

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  return (
    <>
      <div
        onClick={() => setOpenCart(false)}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-all duration-300 ${
          openCart ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[430px] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.25)] transform ${
          openCart ? "translate-x-0" : "translate-x-full"
        } transition-all duration-500 z-50 flex flex-col`}
      >
        <div className="px-7 py-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <ShoppingBag size={18} />
            Carrito
            <span className="text-sm text-gray-400 font-normal">
              ({carrito.length})
            </span>
          </h2>

          <button
            onClick={() => setOpenCart(false)}
            className="text-gray-400 hover:text-black transition text-lg"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">

          {carrito.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={46} className="text-gray-200 mb-5" />

              <p className="font-medium text-gray-800 text-lg">
                Tu carrito está vacío
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Descubre nuestros últimos lanzamientos
              </p>

              <button
                onClick={() => setOpenCart(false)}
                className="mt-7 px-7 py-3 border rounded-full text-sm hover:bg-black hover:text-white transition"
              >
                Explorar productos
              </button>
            </div>
          )}

          {carrito.map((p, i) => (
            <div
              key={i}
              className="group rounded-3xl border border-gray-100 p-4 hover:shadow-md transition-all duration-300"
            >
              <div className="flex gap-4">

                <div className="w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center bg-white">
                  <img
                    src={`/assets/${p.imagen}`}
                    className="w-full h-full object-contain p-2 transition duration-300 group-hover:scale-105"
                    alt={p.nombre}
                  />
                </div>

                <div className="flex-1 min-w-0">

                  <div className="flex justify-between gap-3">
                    <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-2">
                      {p.nombre}
                    </h3>

                    <button
                      onClick={() => eliminarDelCarrito(i)}
                      className="text-gray-300 hover:text-red-500 transition"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  {p.size && (
                    <p className="text-xs text-gray-400 mt-1">
                      Talla {p.size}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    S/ {p.precio}
                  </p>

                  <div className="flex items-center justify-between mt-4">

                    <div className="flex items-center bg-gray-50 rounded-full px-2 py-1 gap-2 border">
                      <button
                        onClick={() => actualizarCantidad(i, p.cantidad - 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white transition"
                      >
                        <Minus size={13} />
                      </button>

                      <span className="text-sm font-medium w-5 text-center">
                        {p.cantidad}
                      </span>

                      <button
                        onClick={() => actualizarCantidad(i, p.cantidad + 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white transition"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <p className="text-sm font-semibold">
                      S/ {(p.precio * p.cantidad).toFixed(2)}
                    </p>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-7 py-6 border-t border-gray-100 bg-white">

          <div className="bg-gray-50 rounded-3xl p-5">

            <div className="border-t mt-4 pt-4 flex justify-between items-center">
              <span className="text-sm font-medium">Total</span>
              <span className="text-2xl font-semibold tracking-tight">
                S/ {total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            disabled={carrito.length === 0}
            onClick={() => {
              setOpenCart(false);
              navigate("/checkout");
            }}
            className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-900 active:scale-[0.98] transition disabled:bg-gray-300"
          >
            Finalizar compra
          </button>

          <button
            onClick={() => setOpenCart(false)}
            className="w-full text-sm text-gray-500 hover:text-black transition mt-4"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;