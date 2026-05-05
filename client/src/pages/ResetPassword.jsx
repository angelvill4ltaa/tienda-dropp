import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [tokenExpired, setTokenExpired] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  const isMatch = password === confirmPassword && confirmPassword.length > 0;
  const isValid = password.length >= 6 && isMatch;

  useEffect(() => {
  const verifyToken = async () => {
    try {
      const res = await fetch(`http://localhost:5001/auth/verify-reset-token/${token}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);
    } catch (err) {
      setTokenExpired(true);
    } finally {
      setCheckingToken(false);
    }
  };

  verifyToken();
}, [token]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return setError("La contraseña debe tener mínimo 6 caracteres");
    }

    if (password !== confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }

    setError("");
    setLoading(true);

    Swal.fire({
      title: '<span style="font-size:22px;font-weight:700;">Actualizando contraseña...</span>',
      html: '<p style="font-size:14px;color:#777;">Estamos asegurando tu cuenta.</p>',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await fetch("http://localhost:5001/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      await Swal.fire({
        icon: "success",
        title: '<span style="font-size:24px;font-weight:800;">Contraseña actualizada</span>',
        html: `
          <p style="font-size:14px;color:#666;line-height:1.7;">
            Tu acceso ha sido restablecido correctamente.
            Ya puedes iniciar sesión con tu nueva contraseña.
          </p>
        `,
        confirmButtonText: "Ir a iniciar sesión",
        confirmButtonColor: "#000",
        width: "470px",
        padding: "2em",
        borderRadius: "24px",
      });

      navigate("/auth");
    } catch (err) {
  Swal.close();

  if (
    err.message.toLowerCase().includes("token") ||
    err.message.toLowerCase().includes("expir") ||
    err.message.toLowerCase().includes("inválido") ||
    err.message.toLowerCase().includes("invalido")
  ) {
    setTokenExpired(true);
  } else {
    setError(err.message);
  }
} finally {
      setLoading(false);
    }
  };

  if (checkingToken) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4]">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-5"></div>
        <p className="text-sm tracking-[0.2em] uppercase text-gray-500">
          Verificando enlace seguro...
        </p>
      </div>
    </div>
  );
}

    if (tokenExpired) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4] px-6">
      <div className="w-full max-w-lg bg-white rounded-[32px] p-12 shadow-[0_20px_60px_rgba(0,0,0,0.08)] text-center">

        <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-4">
          Secure link expired
        </p>

        <h2 className="text-4xl font-black tracking-tight mb-4">
          Este enlace ya no es válido
        </h2>

        <p className="text-sm text-gray-500 leading-7 mb-8 max-w-sm mx-auto">
          Por seguridad, los enlaces de recuperación tienen un tiempo limitado de uso.
          Solicita uno nuevo para restablecer tu contraseña.
        </p>

        <button
          onClick={() => navigate("/auth")}
          className="w-full h-[56px] rounded-2xl bg-black text-white font-semibold
          hover:bg-neutral-900 active:scale-[0.985] transition-all duration-300"
        >
          Solicitar nuevo enlace
        </button>
      </div>
    </div>
  );
}

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
            Secure account recovery
          </p>

          <h2 className="text-6xl font-black leading-[1.05] tracking-tight">
            Protege tu acceso
          </h2>

          <p className="text-gray-300 text-sm leading-7 max-w-sm">
            Estás a un paso de volver a ingresar de forma segura a tu cuenta.
          </p>
        </div>

        <p className="relative z-10 text-xs text-gray-500 tracking-[0.15em]">
          © 2026 DROPP
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">

        <div className="w-full max-w-md bg-white/92 backdrop-blur-2xl p-10 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white">

          <div className="mb-10 space-y-2">
            <h2 className="text-4xl font-black tracking-tight">
              Nueva contraseña
            </h2>

            <p className="text-gray-500 text-sm">
              Crea una contraseña segura para continuar
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-5">

            <div className="space-y-1">
              <div className="relative h-[58px] rounded-2xl border border-gray-300 focus-within:border-black focus-within:shadow-[0_0_0_4px_rgba(0,0,0,0.025)] transition-all duration-300">
                <input
                  type={show1 ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  className="peer w-full h-full px-4 pt-4 pr-12 text-sm bg-transparent outline-none"
                />

                <label className="absolute left-4 text-gray-400 pointer-events-none transition-all duration-200 top-1/2 -translate-y-1/2 text-sm
                peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px]
                peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]">
                  Nueva contraseña 
                </label>

                <button
                  type="button"
                  onClick={() => setShow1(!show1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {show1 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* CONFIRM */}
            <div className="space-y-1">
              <div className="relative h-[58px] rounded-2xl border border-gray-300 focus-within:border-black focus-within:shadow-[0_0_0_4px_rgba(0,0,0,0.025)] transition-all duration-300">
                <input
                  type={show2 ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder=" "
                  className="peer w-full h-full px-4 pt-4 pr-12 text-sm bg-transparent outline-none"
                />

                <label className="absolute left-4 text-gray-400 pointer-events-none transition-all duration-200 top-1/2 -translate-y-1/2 text-sm
                peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px]
                peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]">
                  Confirmar contraseña 
                </label>

                <button
                  type="button"
                  onClick={() => setShow2(!show2)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {show2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {confirmPassword.length > 0 && (
                <p className={`text-xs pl-1 ${isMatch ? "text-green-600" : "text-red-500"}`}>
                  {isMatch ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                </p>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={!isValid || loading}
              className={`w-full h-[56px] rounded-2xl font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_14px_30px_rgba(0,0,0,0.18)]
              ${
                isValid
                  ? "bg-black text-white hover:bg-neutral-900 active:scale-[0.985]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
              }`}
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Actualizar contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;