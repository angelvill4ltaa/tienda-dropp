import { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [categoria, setCategoria] = useState("todos");
  const [carrito, setCarrito] = useState(() => {
    const saved = localStorage.getItem("carrito");
    return saved ? JSON.parse(saved) : [];
  });
  const [openCart, setOpenCart] = useState(false);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);

      if (existe) {
        return prev.map((p) =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      }

      return [...prev, { ...producto, cantidad: 1 }];
    });

    setOpenCart(true);
  };

    const limpiarCarrito = () => {
  setCarrito([]);
};

  const eliminarDelCarrito = (index) => {
    setCarrito((prev) => prev.filter((_, i) => i !== index));
  };

  const actualizarCantidad = (index, cantidad) => {
    if (cantidad < 1) return;

    setCarrito((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, cantidad } : p
      )
    );
  };

  return (
    <StoreContext.Provider
      value={{
        categoria,
        setCategoria,
        carrito,
        agregarAlCarrito,
        limpiarCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        openCart,
        setOpenCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);