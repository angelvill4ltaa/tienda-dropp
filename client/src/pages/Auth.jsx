import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import FloatingInput from "../components/FloatingInput";

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const initialForm = {
    nombre: "",
    email: "",
    password: "",
  };

  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState({});

  const isLogin = mode === "login";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

    return errors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const errors = validateAllFields();

  if (Object.keys(errors).length > 0) {
      setFieldError(errors);
    setError("Corrige los campos antes de continuar");
    return;
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
        text: "Si el correo ingresado es válido, recibirás un enlace para activar tu cuenta en unos minutos.",
          
        confirmButtonText: "Entendido",
        confirmButtonColor: "#000",
      });

      setMode("login");
      setForm(initialForm);
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleForgotPassword = async () => {
  const { value: email } = await Swal.fire({
    title: "Recuperar acceso",
    text: "Ingresa tu correo para enviarte un enlace de recuperación.",

    input: "email",
    inputPlaceholder: "correo@ejemplo.com",

    showCancelButton: true,
    confirmButtonText: "Enviar enlace",
    cancelButtonText: "Cancelar",

    confirmButtonColor: "#000",

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
    text: "Estamos verificando tu cuenta.",
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
      text: `Hemos enviado un enlace seguro a ${email} para restablecer tu contraseña.`,
      confirmButtonText: "Entendido",
      confirmButtonColor: "#000",
    });
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Correo no registrado",
      text: `No existe ninguna cuenta asociada a ${email}. Verifica el correo o crea una nueva cuenta.`,
      confirmButtonText: "Cerrar",
      confirmButtonColor: "#000",
    });
  }
};

  return (
    <div className="min-h-screen flex bg-neutral-100">

      <div className="hidden lg:flex w-1/2 text-white flex-col justify-between p-16 relative overflow-hidden">
        <img
          src="https://i.pinimg.com/736x/24/8c/e7/248ce7a5c15b709383877a73bc7cbb18.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        <div className="absolute inset-0 bg-black/65 from-black via-black/20 to-black/30" />

      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white backdrop-blur-xl p-10 rounded-[32px] border border-white">

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
              <FloatingInput
                label="Nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                error={fieldError.nombre}
              />
            )}

            <FloatingInput
              label="Correo"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={fieldError.email}
            />

            <FloatingInput
              label="Contraseña"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              error={fieldError.password}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-black"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

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
              className="w-full bg-black text-white h-14 rounded-2xl font-semibold tracking-wide flex items-center justify-center gap-2 hover:bg-neutral-900 transition-all duration-300 shadow-[0_14px_30px_rgba(0,0,0,0.18)]"
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
                setForm(initialForm);
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
            className="w-full h-14 border border-gray-200 rounded-2xl flex items-center justify-center gap-3 text-sm font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            Continuar con Google
          </button>

        </div>
      </div>
    </div>
  );
};

export default Auth;