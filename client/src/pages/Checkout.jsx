import { useStore } from "../context/StoreContext";
import Footer from "../components/Footer";
import { useState } from "react";
import { Lock, Loader2, Truck, CreditCard, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import FloatingInput from "../components/FloatingInput";

const Checkout = () => {
  const { user } = useAuth();
  const { carrito, limpiarCarrito } = useStore();

  const [form, setForm] = useState({
    nombre: user?.nombre || "",
    correo: user?.email || "",
    direccion: "",
    telefono: "",
    dni: "",
  });

  const [card, setCard] = useState({
    numero: "",
    nombre: "",
    expiracion: "",
    cvv: "",
  });

  const isValidCardNumber = (num) => {
    const clean = num.replace(/\s/g, "");
    return /^\d{16}$/.test(clean);
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const isValidExpiry = (exp) => {
  if (!/^\d{2}\/\d{2}$/.test(exp)) return false;

  const [mes, anio] = exp.split("/").map(Number);

  if(mes < 1 || mes > 12) return false;

  const ahora = new Date();
  const anioActual = ahora.getFullYear() % 100;
  const mesActual = ahora.getMonth() + 1;

  if (anio < anioActual) return false;
  if (anio === anioActual && mes < mesActual) return false;

  return true;
};

  const formatExpiry = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{1,2})/, "$1/$2")
      .substring(0, 5);
  };

  const handleCardChange = ({ target: { name, value } }) => {
    if (name === "numero") {
      value = formatCardNumber(value).substring(0, 19);
    }

    if (name === "expiracion") {
      value = formatExpiry(value);
    }

    if (name === "cvv") {
      value = onlyNumbers(value, 4);
    }
    
    setCard((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [`card${name.charAt(0).toUpperCase() + name.slice(1)}`]: null
    }));
  }; 

  const [metodoEnvio, setMetodoEnvio] = useState("standard");
  const [metodoPago, setMetodoPago] = useState("tarjeta");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const subtotal = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  const envioCosto =
    metodoEnvio === "express" ? 20 : subtotal > 500 ? 0 : 10;

  const total = subtotal + envioCosto;
  
  const onlyNumbers = (value, limit) =>
  value.replace(/\D/g, "").slice(0, limit);

  const handleChange = ({ target: { name, value } }) => {

    if (name === "dni") value = onlyNumbers(value, 8);
    if (name === "telefono") value = onlyNumbers(value, 9);
    
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errors = {};

    if (!form.nombre.trim()) {
      errors.nombre = "Ingresa tu nombre completo";
    }

    if (!form.correo.trim()) {
      errors.correo = "Ingresa tu correo electrónico";
    } else if (!/^\S+@\S+\.\S+$/.test(form.correo)) {
      errors.correo = "Formato de correo inválido";
    }

    if (!form.dni.trim()) {
      errors.dni = "Ingresa tu DNI";
    } else if (!/^\d{8}$/.test(form.dni)) {
      errors.dni = "El DNI debe tener 8 dígitos";
    }

    if (!form.telefono.trim()) {
      errors.telefono = "Ingresa tu teléfono";
    } else if (!/^\d{9}$/.test(form.telefono)) {
      errors.telefono = "El teléfono debe tener 9 dígitos";
    }

    if (!form.direccion.trim()) {
      errors.direccion = "Ingresa tu dirección de entrega";
    }

    if (metodoPago === "tarjeta") {
      if (!isValidCardNumber(card.numero)) {
        errors.cardNumero = "Número de tarjeta inválido";
      }

      if (!card.nombre.trim()) {
        errors.cardNombre = "Nombre en tarjeta requerido";
      }

      if (!isValidExpiry(card.expiracion)) {
        errors.cardExp = "Fecha inválida";
      }

      if (!card.cvv || card.cvv.length < 3) {
        errors.cardCvv = "CVV inválido";
      }
    }
    return errors;
  };

  const handlePago = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/crear-orden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carrito,
          metodoEnvio,
          metodoPago,
          envioCosto,
          total,
          cliente: form,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error en el pago");

      localStorage.setItem(
        "pedido",
        JSON.stringify({
          productos: carrito,
          envioCosto,
          total,
          cliente: form,
        })
      );

      limpiarCarrito();
      window.location.href = `/orden-exitosa/${data.ordenId}`;
    } catch (err) {
      setErrors({ global: err.message });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    form.nombre.trim() &&
    form.correo.trim() &&
    form.direccion.trim() &&
    form.telefono.trim() &&
    form.dni.trim();

  const isCardValid =
    metodoPago !== "tarjeta" ||
    (
      isValidCardNumber(card.numero) &&
      card.nombre &&
      isValidExpiry(card.expiracion) &&
      card.cvv.length >= 3
    );

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-white border-b border-gray-200 px-6 md:px-12 py-5">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold mt-1">
        Finalizar compra
      </h1>
    </div>

    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Lock size={15} />
      Pago 100% seguro
    </div>
  </div>
</div>

      <main className="flex-grow px-6 md:px-12 py-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">

          <div className="space-y-6">

            <div className="bg-white p-10 rounded-3xl border">
              <h2 className="text-2xl font-semibold mb-6">
                Datos de envío
              </h2>

              <div className="grid gap-6">
                <FloatingInput
                  name="nombre"
                  label="Nombre completo"
                  value={form.nombre}
                  onChange={handleChange}
                  error={errors.nombre}
                />

                <FloatingInput
                  name="correo"
                  label="Correo electrónico"
                  value={form.correo}
                  onChange={handleChange}
                  error={errors.correo}
                />

                <FloatingInput
                  name="dni"
                  label="DNI"
                  value={form.dni}
                  onChange={handleChange}
                  error={errors.dni}
                  inputMode="numeric"
                  maxLength={8}
                />

                <FloatingInput
                  name="telefono"
                  label="Teléfono"
                  value={form.telefono}
                  onChange={handleChange}
                  error={errors.telefono}
                  inputMode="numeric"
                  maxLength={9}
                />

                <FloatingInput
                  name="direccion"
                  label="Dirección de entrega"
                  value={form.direccion}
                  onChange={handleChange}
                  error={errors.direccion}
                />
              </div>

              {errors.global && (
                <div className="mt-6 text-sm text-red-500 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                  {errors.global}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl border space-y-3">
              <h2 className="font-semibold flex items-center gap-2">
                <Truck size={16} /> Método de envío
              </h2>

              {["standard", "express"].map((tipo) => (
                <label
                  key={tipo}
                  className={`flex justify-between items-center p-4 rounded-xl cursor-pointer border
                  ${
                    metodoEnvio === tipo
                      ? "border-black bg-gray-50"
                      : "hover:border-gray-400"
                  }`}
                >
                  <div>
                    <p className="font-medium text-sm">
                      {tipo === "standard"
                        ? "Entrega normal (24–72h)"
                        : "Entrega express (24h)"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {tipo === "standard"
                        ? "Gratis desde S/500"
                        : "Prioritario"}
                    </p>
                  </div>

                  <input
                    type="radio"
                    checked={metodoEnvio === tipo}
                    onChange={() => setMetodoEnvio(tipo)}
                    className="accent-black"
                  />
                </label>
              ))}
            </div>

            <div className="bg-white p-6 rounded-2xl border space-y-3">
              <h2 className="font-semibold flex items-center gap-2">
                <CreditCard size={16} /> Método de pago
              </h2>

              {[
                { id: "tarjeta", label: "Tarjeta" },
                { id: "yape", label: "Yape" },
              ].map((pago) => (
                <label
                  key={pago.id}
                  className={`flex justify-between items-center p-4 rounded-xl cursor-pointer border
                  ${
                    metodoPago === pago.id
                      ? "border-black bg-gray-50"
                      : "hover:border-gray-400"
                  }`}
                >
                  <span className="font-medium text-sm">{pago.label}</span>

                  <input
                    type="radio"
                    checked={metodoPago === pago.id}
                    onChange={() => setMetodoPago(pago.id)}
                    className="accent-black"
                  />
                </label>
              ))}
            </div>

            {metodoPago === "yape" && (
              <div className="mt-4 border rounded-2xl p-6 text-center space-y-4">

                <p className="text-sm font-medium">
                  Escanea el QR con Yape
                </p>

                <div className="w-40 h-40 mx-auto bg-white border rounded-xl flex items-center justify-center">
                  <img
                    src="/assets/Qr.jpg" 
                    alt="QR Yape"
                    className="w-full h-full object-contain p-2"/>
                </div>

                <p className="text-xs text-gray-500">
                  Usa tu app de Yape para completar el pago
                </p>

                <div className="text-sm bg-gray-50 border rounded-xl p-3">
                  <p className="font-medium">Total a pagar</p>
                  <p className="text-lg font-semibold">
                    S/ {total.toFixed(2)}
                  </p>
                </div>

              </div>
            )}

          {metodoPago === "tarjeta" && (
            <div className="mt-4 border rounded-3xl p-6 space-y-5">
 
             <p className="text-sm font-semibold">
               Información de la tarjeta
             </p>

             <FloatingInput
               name="numero"
               label="Número de tarjeta"
               value={card.numero}
               onChange={handleCardChange}
               error={errors.cardNumero}
               inputMode="numeric"
               maxLength={19}
             />

             <FloatingInput
               name="nombre"
               label="Nombre en la tarjeta"
               value={card.nombre}
               onChange={handleCardChange}
               error={errors.cardNombre}
              />

              <div className="grid grid-cols-2 gap-4">
                  <FloatingInput
                    name="expiracion"
                    label="MM/AA"
                    value={card.expiracion}
                    onChange={handleCardChange}
                    error={errors.cardExp}
                    inputMode="numeric"
                    maxLength={5}
                  />

                  <FloatingInput
                    name="cvv"
                    label="CVV"
                    value={card.cvv}
                    onChange={handleCardChange}
                    error={errors.cardCvv}
                    inputMode="numeric"
                    maxLength={4}
                  />
            </div>

            <p className="text-xs text-gray-400 flex items-center gap-1">
            <Lock size={13} />
              Tus datos están protegidos 
            </p>
         </div>
        )}

            
          </div>

          <div className="bg-white p-8 rounded-3xl border sticky top-10 h-fit">

  <div className="flex items-center justify-between mb-7">
    <h2 className="text-xl font-semibold">
      Resumen de compra
    </h2>

    <span className="text-[11px] px-3 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
      {carrito.length} item{carrito.length !== 1 && "s"}
    </span>
  </div>

  <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
    {carrito.map((p, i) => (
      <div
        key={i}
        className="flex gap-4 items-center border-b border-gray-100 pb-4"
      >
        <div className="w-16 h-16 border rounded-2xl">
          <img
            src={`/assets/${p.imagen}`}
            className="object-contain h-full w-full p-2"
            alt=""
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {p.nombre}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            x{p.cantidad} {p.size && `• Talla ${p.size}`}
          </p>
        </div>

        <p className="text-sm font-semibold">
          S/ {(p.precio * p.cantidad).toFixed(2)}
        </p>
      </div>
    ))}
  </div>

  <div className="mt-7 space-y-3 text-sm">
    <div className="flex justify-between">
      <span className="text-gray-500">Subtotal</span>
      <span className="font-medium">S/ {subtotal.toFixed(2)}</span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-500">Costo de envío</span>
      <span className={envioCosto === 0 ? "text-green-600 font-medium" : "font-medium"}>
        {envioCosto === 0 ? "Gratis" : `S/ ${envioCosto}`}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-500">Método</span>
      <span className="font-medium capitalize">
        {metodoPago}
      </span>
    </div>
  </div>

  <div className="my-7 border-t pt-6">
    <div className="flex justify-between items-end">
      <span className="text-gray-500 text-sm">Total a pagar</span>
      <span className="text-3xl font-medium">
        S/ {total.toFixed(2)}
      </span>
    </div>
  </div>

  <button
    onClick={handlePago}
    disabled={loading || carrito.length === 0 || !isFormValid || !isCardValid}
    className="w-full py-4 rounded-full bg-black text-white flex items-center justify-center gap-2 disabled:bg-gray-300"
  >
    {loading ? (
      <>
        <Loader2 className="animate-spin" size={18} />
        Procesando pago...
      </>
    ) : (
      <>
        <ShieldCheck size={18} />
        Confirmar y pagar
               </>
              )}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;