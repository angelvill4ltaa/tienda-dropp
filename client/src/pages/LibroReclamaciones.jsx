import { useState } from "react";
import { CheckCircle, AlertCircle, FileText, Loader2, ShieldCheck, ClipboardList, } from "lucide-react";

const Input = ({ name, label, value, onChange, error }) => {
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
          inputMode={name === "dni" || name === "telefono" ? "numeric" : "text"}
          pattern={name === "dni" || name === "telefono" ? "[0-9]*" : undefined}
          className="peer w-full h-full px-4 pt-4 text-sm bg-transparent outline-none"
        />

        <label
          className="absolute left-4 text-gray-400 pointer-events-none transition-all duration-200
          top-1/2 -translate-y-1/2 text-sm
          peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px]
          peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]"
        >
          {label}
        </label>
      </div>

      {error && <p className="text-red-500 text-xs pl-1">{error}</p>}
    </div>
  );
};

const LibroReclamaciones = () => {
  const [form, setForm] = useState({
    nombre: "",
    dni: "",
    email: "",
    telefono: "",
    tipo: "reclamo",
    mensaje: "",
  });

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

    if (name === "dni") value = value.replace(/\D/g, "").slice(0, 8);
    if (name === "telefono") value = value.replace(/\D/g, "").slice(0, 9);

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
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

      setForm({
        nombre: "",
        dni: "",
        email: "",
        telefono: "",
        tipo: "reclamo",
        mensaje: "",
      });

      setErrors({});
    } catch (err) {
      setErrors({ global: "Error al enviar el reclamo" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">

      <div className="bg-black text-white py-14 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <FileText className="mx-auto mb-4" size={30} />
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Libro de Reclamaciones
          </h1>
          <p className="text-gray-400 text-sm mt-3 max-w-2xl mx-auto">
            Plataforma oficial para registrar reclamos o quejas relacionadas con
            nuestros productos, servicios o atención brindada.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-8 text-left">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3">
              <ShieldCheck size={20} className="mt-0.5" />
              <div>
                <p className="font-medium text-sm">Protección al consumidor</p>
                <p className="text-xs text-gray-400 mt-1">
                  Procedimiento conforme a la normativa peruana vigente.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3">
              <ClipboardList size={20} className="mt-0.5" />
              <div>
                <p className="font-medium text-sm">Respuesta garantizada</p>
                <p className="text-xs text-gray-400 mt-1">
                  Recibirás una constancia automática y seguimiento del caso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14">

        <div className="bg-white rounded-[32px] shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-gray-100 p-8 md:p-10">

          <div className="mb-10 bg-gray-50 border border-gray-200 rounded-2xl p-5 text-sm text-gray-600 leading-relaxed">
            Registra un <strong>reclamo</strong> cuando exista disconformidad con el
            producto o servicio recibido, o una <strong>queja</strong> cuando la
            inconformidad esté relacionada con la atención brindada.
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">

            <div>
              <h3 className="text-sm font-semibold mb-5">1. Datos del cliente</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <Input name="nombre" label="Nombre completo" value={form.nombre} onChange={handleChange} error={errors.nombre} />
                <Input name="dni" label="DNI" value={form.dni} onChange={handleChange} error={errors.dni} />
                <Input name="email" label="Correo electrónico" value={form.email} onChange={handleChange} error={errors.email} />
                <Input name="telefono" label="Teléfono" value={form.telefono} onChange={handleChange} error={errors.telefono} />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-5">2. Tipo de solicitud</h3>

              <div className="grid grid-cols-2 gap-4">
                {["reclamo", "queja"].map((tipo) => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => setForm({ ...form, tipo })}
                    className={`rounded-2xl border px-5 py-4 text-left transition-all duration-300
                    ${
                      form.tipo === tipo
                        ? "bg-black text-white border-black shadow-md"
                        : "border-gray-300 bg-white hover:border-black"
                    }`}
                  >
                    <p className="font-semibold text-sm">
                      {tipo === "reclamo" ? "Reclamo" : "Queja"}
                    </p>
                    <p className={`text-xs mt-1 ${form.tipo === tipo ? "text-gray-300" : "text-gray-500"}`}>
                      {tipo === "reclamo"
                        ? "Disconformidad con producto o servicio."
                        : "Malestar con la atención recibida."}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-5">3. Detalle del caso</h3>

              <div
                className={`relative rounded-2xl border transition-all duration-300
                ${
                  errors.mensaje
                    ? "border-red-500"
                    : "border-gray-300 focus-within:border-black focus-within:shadow-[0_0_0_4px_rgba(0,0,0,0.025)]"
                }`}
              >
                <textarea
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  maxLength={500}
                  rows="6"
                  placeholder=" "
                  className="peer w-full px-4 pt-6 pb-3 text-sm bg-transparent outline-none resize-none"
                />

                <label
                  className="absolute left-4 text-gray-400 pointer-events-none transition-all duration-200
                  top-5 text-sm
                  peer-focus:top-2.5 peer-focus:text-[11px]
                  peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-[11px]"
                >
                  Describe detalladamente lo sucedido
                </label>
              </div>

              <div className="flex justify-between text-xs mt-1">
                <span className="text-red-500">{errors.mensaje}</span>
                <span className="text-gray-400">{form.mensaje.length}/500</span>
              </div>
            </div>

            {errors.global && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                <AlertCircle size={16} />
                {errors.global}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
                <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
                  <CheckCircle size={17} />
                  Solicitud registrada correctamente
                </div>

                <p className="text-xs text-gray-700 mt-2">
                  Código de seguimiento: <strong>{reclamoId}</strong>
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Nuestro equipo te responderá en un plazo máximo de 48 horas hábiles.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[54px] bg-black text-white rounded-full text-sm font-medium
              flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Enviando solicitud...
                </>
              ) : (
                "Registrar reclamo / queja"
              )}
            </button>
          </form>

          <div className="mt-10 pt-5 border-t text-xs text-gray-400 leading-relaxed">
            La presentación del reclamo no impide acudir posteriormente a INDECOPI
            o a cualquier otra vía de solución de controversias prevista por ley.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibroReclamaciones;