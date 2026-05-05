import { useStore } from "../context/StoreContext";
import Footer from "../components/Footer";
import { useState } from "react";
import { Lock, Loader2, Truck, CreditCard, ShieldCheck, ClipboardList, } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const FloatInput = ({
  name,
  label,
  value,
  onChange,
  error,
  numeric = false,
}) => {
  return (
    <div className="space-y-1">
      <div
        className={`relative h-[58px] rounded-2xl border transition-all duration-300
        ${
          error
            ? "border-red-500"
            : "border-gray-300 focus-within:border-black focus-within:shadow-[0_0_0_4px_rgba(0,0,0,0.025)]"
        }`}
      >
        <input
          name={name}
          value={value}
          onChange={onChange}
          placeholder=" "
          inputMode={numeric ? "numeric" : "text"}
          className="peer w-full h-full px-4 pt-4 text-sm bg-transparent outline-none"
        />

        <label
          className={`absolute left-4 pointer-events-none transition-all duration-200
          top-1/2 -translate-y-1/2 text-sm
          peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px]
          peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]
          ${
            error
              ? "text-red-400"
              : "text-gray-400 peer-focus:text-gray-500"
          }`}
        >
          {label}
        </label>
      </div>

      {error && <p className="text-red-500 text-xs pl-1">{error}</p>}
    </div>
  );
};

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

  const handleCardChange = (e) => {
    let { name, value } = e.target; 

    if (name === "numero") {
      value = formatCardNumber(value).substring(0, 19);
    }

    if (name === "expiracion") {
      value = formatExpiry(value);
    }

    if (name === "cvv") {
      value = value.replace(/\D/g, "").substring(0, 4);
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
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  const envioCosto =
    metodoEnvio === "express" ? 20 : subtotal > 500 ? 0 : 10;

  const total = subtotal + envioCosto;

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "dni") {
    value = value.replace(/\D/g, "").slice(0, 8);
  }

  if (name === "telefono") {
    value = value.replace(/\D/g, "").slice(0, 9);
  }

    setForm((prev) => ({
  ...prev,
  [name]: value,
}));

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
    <div className="flex flex-col min-h-screen bg-gray-50">

      <div className="bg-white border-b border-gray-200 px-6 md:px-12 py-5">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    <div>
      <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 font-semibold">
        DROPP SECURE CHECKOUT
      </p>
      <h1 className="text-2xl font-bold tracking-tight mt-1">
        Finalizar compra
      </h1>
    </div>

    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Lock size={15} />
      Pago 100% seguro
    </div>
  </div>
</div>

      <main className="flex-grow px-6 md:px-12 py-14">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14">

          <div className="space-y-10">

            {/* DATOS */}
            <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-[0_5px_20px_rgba(0,0,0,0.04)]">
              <h2 className="text-2xl font-semibold mb-10 tracking-tight">
                Datos de envío
              </h2>

              <div className="grid grid-cols-1 gap-6">
  <FloatInput
    name="nombre"
    label="Nombre completo"
    value={form.nombre}
    onChange={handleChange}
    error={errors.nombre}
  />

  <FloatInput
    name="correo"
    label="Correo electrónico"
    value={form.correo}
    onChange={handleChange}
    error={errors.correo}
  />

  <FloatInput
    name="dni"
    label="DNI"
    value={form.dni}
    onChange={handleChange}
    error={errors.dni}
    numeric
  />

  <FloatInput
    name="telefono"
    label="Teléfono"
    value={form.telefono}
    onChange={handleChange}
    error={errors.telefono}
    numeric
  />

  <FloatInput
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

            {/* ENVÍO */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-[0_5px_20px_rgba(0,0,0,0.04)] space-y-3">
              <h2 className="font-semibold flex items-center gap-2">
                <Truck size={16} /> Método de envío
              </h2>

              {["standard", "express"].map((tipo) => (
                <label
                  key={tipo}
                  className={`flex justify-between items-center p-4 rounded-xl cursor-pointer border transition-all
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

            {/* PAGO */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-[0_5px_20px_rgba(0,0,0,0.04)] space-y-3">
              <h2 className="font-semibold flex items-center gap-2">
                <CreditCard size={16} /> Método de pago
              </h2>

              {[
                { id: "tarjeta", label: "Tarjeta" },
                { id: "yape", label: "Yape" },
              ].map((pago) => (
                <label
                  key={pago.id}
                  className={`flex justify-between items-center p-4 rounded-xl cursor-pointer border transition
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

            {/* PAGOS */}
            {metodoPago === "yape" && (
              <div className="mt-4 border border-gray-200 rounded-2xl p-6 text-center space-y-4">

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
            <div className="mt-4 border border-gray-200 rounded-3xl p-6 space-y-5 bg-white shadow-[0_5px_20px_rgba(0,0,0,0.03)]">
 
                  <div className="rounded-[30px] bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-7 shadow-[0_18px_40px_rgba(0,0,0,0.22)] mb-6 overflow-hidden relative">

  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5"></div>
  <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-white/5"></div>

  <div className="relative z-10">
    <div className="flex justify-between items-center mb-10">
      <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400">
        Secure Payment
      </p>

      <CreditCard size={20} className="text-gray-300" />
    </div>

    <div className="text-2xl md:text-3xl tracking-[0.20em] font-light mb-8">
      {card.numero || "•••• •••• •••• ••••"}
    </div>

    <div className="flex justify-between items-end">
      <div>
        <p className="text-[10px] uppercase text-gray-400 mb-1">
          Card Holder
        </p>
        <p className="text-sm tracking-wide">
          {card.nombre || "NOMBRE COMPLETO"}
        </p>
      </div>

      <div>
        <p className="text-[10px] uppercase text-gray-400 mb-1">
          Expires
        </p>
        <p className="text-sm">
          {card.expiracion || "MM/AA"}
        </p>
      </div>
    </div>
  </div>
</div>
  
             <p className="text-sm font-semibold">
               Información de la tarjeta
             </p>

             <FloatInput
               name="numero"
               label="Número de tarjeta"
               value={card.numero}
               onChange={handleCardChange}
               error={errors.cardNumero}
               numeric
             />

             <FloatInput
               name="nombre"
               label="Nombre en la tarjeta"
               value={card.nombre}
               onChange={handleCardChange}
               error={errors.cardNombre}
              />

              <div className="grid grid-cols-2 gap-4">
                  <FloatInput
                    name="expiracion"
                    label="MM/AA"
                    value={card.expiracion}
                    onChange={handleCardChange}
                    error={errors.cardExp}
                    numeric
                />

                  <FloatInput
                    name="cvv"
                    label="CVV"
                    value={card.cvv}
                    onChange={handleCardChange}
                    error={errors.cardCvv}
                    numeric
                  />
            </div>

            <p className="text-xs text-gray-400 flex items-center gap-1">
            <Lock size={13} />
              Tus datos están protegidos 
            </p>
         </div>
        )}

            
          </div>

          {/* RIGHT */}
          <div className="bg-white p-8 md:p-9 rounded-[34px] border border-gray-200 shadow-[0_14px_40px_rgba(0,0,0,0.06)] sticky top-10 h-fit">

  <div className="flex items-center justify-between mb-7">
    <h2 className="text-xl font-semibold tracking-tight">
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
        <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
          <img
            src={`/assets/${p.imagen}`}
            className="object-contain h-full w-full p-2"
            alt=""
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight line-clamp-2">
            {p.nombre}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            x{p.cantidad} {p.size && `• Talla ${p.size}`}
          </p>
        </div>

        <p className="text-sm font-semibold whitespace-nowrap">
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
      <span className="text-3xl font-black tracking-tight">
        S/ {total.toFixed(2)}
      </span>
    </div>
  </div>

  <button
    onClick={handlePago}
    disabled={loading || carrito.length === 0 || !isFormValid || !isCardValid}
    className="w-full bg-black text-white py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-gray-900 active:scale-[0.98] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
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

  <div className="grid grid-cols-3 gap-3 mt-5 text-center">
    <div className="border rounded-2xl py-3 px-2">
      <Lock size={15} className="mx-auto mb-1 text-gray-500" />
      <p className="text-[10px] text-gray-500">SSL Seguro</p>
    </div>

    <div className="border rounded-2xl py-3 px-2">
      <Truck size={15} className="mx-auto mb-1 text-gray-500" />
      <p className="text-[10px] text-gray-500">Envío rápido</p>
    </div>

    <div className="border rounded-2xl py-3 px-2">
      <ClipboardList size={15} className="mx-auto mb-1 text-gray-500" />
      <p className="text-[10px] text-gray-500">Orden segura</p>
    </div>
  </div>

  <p className="text-[11px] text-gray-400 mt-5 text-center leading-relaxed">
    Al confirmar tu compra aceptas el procesamiento seguro de datos y la emisión automática de tu orden.
  </p>
</div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;