const API_URL = "http://localhost:5001";

export const getProductos = async () => {
  const res = await fetch(`${API_URL}/productos`);
  return res.json();
};

export const getProductoById = async (id) => {
  const res = await fetch(`${API_URL}/productos/${id}`);
  return res.json();
};