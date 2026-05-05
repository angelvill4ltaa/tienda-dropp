import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState({});

  const isLogin = mode === "login";

  const validateField = (name, value) => {
    let newError = "";

    if (name === "nombre" && !isLogin && !value.trim()) {
      newError = "Nombre requerido";
    }

    if (name === "email") {
      if (!value.trim()) {
        newError = "Correo requerido";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newError = "Correo inválido";
      }
    }

    if (name === "password") {
      if (!value) {
        newError = "Contraseña requerida";
      } else if (value.length < 6) {
        newError = "Mínimo 6 caracteres";
      }
    }

    setFieldError((prev) => ({
      ...prev,
      [name]: newError,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldError[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateAllFields = () => {
    const errors = {};

    if (!isLogin && !form.nombre.trim()) {
      errors.nombre = "Nombre requerido";
    }

    if (!form.email.trim()) {
      errors.email = "Correo requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Correo inválido";
    }

    if (!form.password) {
      errors.password = "Contraseña requerida";
    } else if (form.password.length < 6) {
      errors.password = "Mínimo 6 caracteres";
    }

    setFieldError(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const isValid = validateAllFields();

  if (!isValid) {
    return setError("Corrige los campos antes de continuar");
  }

  setError("");
  setLoading(true);

  try {
    const res = await fetch(
      `http://localhost:5001/auth/${isLogin ? "login" : "register"}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    if (isLogin) {
      login(data);
      navigate("/");
    } else {
      Swal.fire({
        icon: "success",
        title: "Verifica tu correo",
        html: `
          <p style="font-size:14px;color:#666;line-height:1.8;">
            Si el correo ingresado es válido, recibirás un enlace para activar tu cuenta en unos minutos.
          </p>
        `,
        confirmButtonText: "Entendido",
        confirmButtonColor: "#000",
        width: "470px",
        padding: "2em",
        borderRadius: "24px",
      });

      setMode("login");
      setForm({
        nombre: "",
        email: "",
        password: "",
      });
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleForgotPassword = async () => {
  const { value: email } = await Swal.fire({
    title: '<span style="font-size:26px;font-weight:800;color:#111;">Recuperar acceso</span>',
    html: `
      <p style="font-size:14px;color:#666;margin-top:-8px;margin-bottom:20px;">
        Ingresa el correo asociado a tu cuenta y te enviaremos un enlace seguro para restablecer tu contraseña.
      </p>
    `,
    input: "email",
    inputPlaceholder: "correo@ejemplo.com",
    confirmButtonText: "Enviar enlace",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#000",
    cancelButtonColor: "#f3f3f3",
    width: "460px",
    padding: "2em",
    borderRadius: "24px",
    inputValidator: (value) => {
      if (!value) return "Debes ingresar un correo";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Ingresa un correo válido";
      }
    },
  });

  if (!email) return;

  Swal.fire({
    title: "Enviando enlace...",
    html: "Estamos verificando tu cuenta.",
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    const res = await fetch("http://localhost:5001/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    Swal.fire({
      icon: "success",
      title: "Revisa tu correo",
      html: `
        <p style="font-size:14px;color:#666;line-height:1.7;">
          Hemos enviado un enlace seguro a <b>${email}</b> para restablecer tu contraseña.
        </p>
      `,
      confirmButtonText: "Entendido",
      confirmButtonColor: "#000",
      width: "470px",
      padding: "2em",
      borderRadius: "24px",
    });
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Correo no registrado",
      html: `
        <p style="font-size:14px;color:#666;line-height:1.7;">
          No existe ninguna cuenta asociada a <b>${email}</b>.
          Verifica el correo o crea una nueva cuenta.
        </p>
      `,
      confirmButtonText: "Cerrar",
      confirmButtonColor: "#000",
      width: "470px",
      padding: "2em",
      borderRadius: "24px",
    });
  }
};

  return (
    <div className="min-h-screen flex bg-[#f4f4f4]">

      <div className="hidden lg:flex w-1/2 text-white flex-col justify-between p-16 relative overflow-hidden">
        <img
          src="https://i.pinimg.com/736x/24/8c/e7/248ce7a5c15b709383877a73bc7cbb18.jpg"
          alt="bg"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30" />

        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-widest">
            DROPP
          </h1>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-300">
            Members only access
          </p>

          <h2 className="text-6xl font-black leading-[1.05] tracking-tight">
            Accede a lo exclusivo
          </h2>

          <p className="text-gray-300 text-sm leading-7 max-w-sm">
            Lanzamientos limitados, compras seguras y beneficios premium para miembros registrados.
          </p>
        </div>

        <p className="relative z-10 text-xs text-gray-500 tracking-[0.15em]">
          © 2026 DROPP
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white/92 backdrop-blur-2xl p-10 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white">

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-black mb-8 transition"
          >
            <ArrowLeft size={16} /> Volver
          </button>

          <div className="mb-10 space-y-2">
            <h2 className="text-4xl font-black tracking-tight">
              {isLogin ? "Bienvenido" : "Crear cuenta"}
            </h2>

            <p className="text-gray-500 text-sm">
              {isLogin ? "Accede a tu cuenta" : "Regístrate para continuar"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {!isLogin && (
              <div className="space-y-1">
                <div className={`relative h-[58px] rounded-2xl border transition-all duration-300 ${fieldError.nombre ? "border-red-500" : "border-gray-300"} focus-within:border-black focus-within:shadow-[0_0_0_4px_rgba(0,0,0,0.025)]`}>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    placeholder=" "
                    className="peer w-full h-full px-4 pt-4 text-sm bg-transparent outline-none"
                  />
                  <label className="absolute left-4 text-gray-400 pointer-events-none transition-all duration-200 top-1/2 -translate-y-1/2 text-sm peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-gray-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]">
                    Nombre completo 
                  </label>
                </div>
                {fieldError.nombre && <p className="text-red-500 text-xs pl-1">{fieldError.nombre}</p>}
              </div>
            )}

            <div className="space-y-1">
              <div className={`relative h-[58px] rounded-2xl border transition-all duration-300 ${fieldError.email ? "border-red-500" : "border-gray-300"} focus-within:border-black focus-within:shadow-[0_0_0_4px_rgba(0,0,0,0.025)]`}>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="email"
                  placeholder=" "
                  className="peer w-full h-full px-4 pt-4 text-sm bg-transparent outline-none"
                />
                <label className="absolute left-4 text-gray-400 pointer-events-none transition-all duration-200 top-1/2 -translate-y-1/2 text-sm peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-gray-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]">
                  Correo 
                </label>
              </div>
              {fieldError.email && <p className="text-red-500 text-xs pl-1">{fieldError.email}</p>}
            </div>

            <div className="space-y-1">
              <div className={`relative h-[58px] rounded-2xl border transition-all duration-300 ${fieldError.password ? "border-red-500" : "border-gray-300"} focus-within:border-black focus-within:shadow-[0_0_0_4px_rgba(0,0,0,0.025)]`}>
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type={showPassword ? "text" : "password"}
                  placeholder=" "
                  className="peer w-full h-full px-4 pt-4 pr-12 text-sm bg-transparent outline-none"
                />
                <label className="absolute left-4 text-gray-400 pointer-events-none transition-all duration-200 top-1/2 -translate-y-1/2 text-sm peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-gray-500 peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]">
                  Contraseña 
                </label>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldError.password && <p className="text-red-500 text-xs pl-1">{fieldError.password}</p>}
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-gray-400 hover:text-black transition"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white h-[56px] rounded-2xl font-semibold tracking-wide flex items-center justify-center gap-2 hover:bg-neutral-900 active:scale-[0.985] transition-all duration-300 shadow-[0_14px_30px_rgba(0,0,0,0.18)]"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {isLogin ? "Ingresar" : "Crear cuenta"}
            </button>
          </form>

          <div className="mt-8 text-sm text-center text-gray-500 border-t border-gray-100 pt-7">
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}

            <button
              onClick={() => {
                setMode(isLogin ? "register" : "login");
                setError("");
                setFieldError({});
                setForm({
                  nombre: "",
                  email: "",
                  password: "",
                });
              }}
              className="ml-2 text-black font-semibold hover:underline"
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </button>
          </div>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">o</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = "http://localhost:5001/auth/google";
            }}
            className="w-full h-[56px] border border-gray-200 rounded-2xl flex items-center justify-center gap-3 text-sm font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            Continuar con Google
          </button>

          <p className="text-xs text-gray-400 mt-8 text-center">
            Al continuar aceptas nuestros términos.
          </p>

        </div>
      </div>
    </div>
  );
};

export default Auth;