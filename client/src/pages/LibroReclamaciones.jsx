import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2, ShieldCheck, ClipboardList } from "lucide-react";

import FloatingInput from "../components/FloatingInput";

const LibroReclamaciones = () => {
  const initialForm = {
    nombre: "",
    dni: "",
    email: "",
    telefono: "",
    tipo: "reclamo",
    mensaje: "",
  };

  const [form, setForm] = useState(initialForm);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reclamoId, setReclamoId] = useState(null);

  const validateField = (name, value) => {
    switch (name) {
      case "nombre":
        return !value.trim() ? "Ingresa tu nombre" : null;

      case "dni":
        return /^\d{8}$/.test(value) ? null : "DNI inválido";

      case "telefono":
        return /^\d{9}$/.test(value) ? null : "Teléfono inválido";

      case "email":
        return /^\S+@\S+\.\S+$/.test(value) ? null : "Correo inválido";

      case "mensaje":
        return value.length < 10 ? "Mínimo 10 caracteres" : null;

      default:
        return null;
    }
  };

  const handleChange = (e) => {
    setSuccess(false);
    setReclamoId(null);

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
  };

  const validate = () => {
    const newErrors = {};

    ["nombre", "dni", "email", "telefono", "mensaje"].forEach((key) => {
      const err = validateField(key, form[key]);

      if (err) {
        newErrors[key] = err;
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      await new Promise((res) => setTimeout(res, 1500));

      const id = "REC-" + Math.floor(Math.random() * 1000000);

      setReclamoId(id);
      setSuccess(true);
      setForm(initialForm);

      setErrors({});
    } catch (err) {
      setErrors({
        global: "Error al enviar el reclamo",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            Libro de Reclamaciones
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-400">
            Si tuviste algún inconveniente con tu compra, producto o atención
            recibida, puedes registrarlo aquí y nuestro equipo te ayudará a resolverlo.
          </p>

          <div className="mt-8 grid gap-4 text-left md:grid-cols-2">
            <div className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
              <ShieldCheck size={20} className="mt-0.5" />

              <div>
                <p className="text-sm font-medium">
                  Protección al consumidor
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Procedimiento conforme a la normativa peruana vigente.
                </p>
              </div>
            </div>

            <div className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
              <ClipboardList size={20} className="mt-0.5" />

              <div>
                <p className="text-sm font-medium">
                  Seguimiento de tu caso
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Recibirás un código para consultar el estado de tu solicitud.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-14">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 md:p-10">
          <div className="mb-10 rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm leading-relaxed text-gray-600">
            Registra un <strong>reclamo</strong> por problemas con un producto o servicio, 
            o una <strong>queja</strong> si tu experiencia de atención no fue la esperada.
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <h3 className="mb-5 text-sm font-semibold">
                1. Datos del cliente
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <FloatingInput
                  label="Nombre completo"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  error={errors.nombre}
                />

                <FloatingInput
                  label="DNI"
                  name="dni"
                  value={form.dni}
                  onChange={handleChange}
                  error={errors.dni}
                />

                <FloatingInput
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                <FloatingInput
                  label="Teléfono"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  error={errors.telefono}
                />
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-sm font-semibold">
                2. Tipo de solicitud
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {["reclamo", "queja"].map((tipo) => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        tipo,
                      }))
                    }
                    className={`rounded-xl border px-5 py-4 text-left transition-colors duration-200 ${
                      form.tipo === tipo
                        ? "border-gray-300 bg-gray-200"
                        : "border-gray-300 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <p className="text-sm font-semibold">
                      {tipo === "reclamo" ? "Reclamo" : "Queja"}
                    </p>

                    <p className="mt-1 text-xs text-gray-600">
                      {tipo === "reclamo"
                        ? "Problemas con tu compra o producto."
                        : "Inconvenientes durante la atención."}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-sm font-semibold">
                3. Detalle del caso
              </h3>

              <div
                className={`relative rounded-xl border transition-colors duration-200 ${
                  errors.mensaje
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
              >
                <textarea
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  maxLength={500}
                  rows="6"
                  placeholder="Cuéntanos qué ocurrió y cómo podemos ayudarte"
                  className="w-full resize-none bg-transparent px-4 pt-4 pb-3 text-sm outline-none"
                />
              </div>

              <div className="mt-1 flex justify-between text-xs">
                <span className="text-red-500">
                  {errors.mensaje}
                </span>

                <span className="text-gray-500">
                  {form.mensaje.length}/500
                </span>
              </div>
            </div>

            {errors.global && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
                <AlertCircle size={16} />
                {errors.global}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4">
                <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                  <CheckCircle size={17} />
                  Tu solicitud fue enviada correctamente
                </div>

                <p className="mt-2 text-xs text-gray-700">
                  Código de seguimiento: <strong>{reclamoId}</strong>
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Te contactaremos lo antes posible para dar seguimiento a tu
                  caso.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-black text-sm font-medium text-white active:opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Enviando solicitud...
                </>
              ) : (
                `Enviar ${
                  form.tipo === "reclamo" ? "Reclamo" : "Queja"
                }`
              )}
            </button>
          </form>

          <div className="mt-10 border-t pt-5 text-xs leading-relaxed text-gray-400">
            La presentación de este reclamo no limita tu derecho de acudir a
            INDECOPI u otras vías de solución de conflictos establecidas por
            ley.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibroReclamaciones;