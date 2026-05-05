import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AccountVerified = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center px-6">
      <div className="max-w-lg w-full bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-12 text-center">
        <CheckCircle2 size={70} className="mx-auto mb-6 text-black" />

        <p className="text-xs tracking-[0.35em] uppercase text-gray-400 mb-3">
          Verificación completada
        </p>

        <h1 className="text-4xl font-black mb-4">
          Cuenta activada
        </h1>

        <p className="text-gray-500 leading-8 text-sm mb-10">
          Tu correo fue confirmado correctamente.
          Ya puedes iniciar sesión y acceder a toda la experiencia DROPP.
        </p>

        <button
          onClick={() => navigate("/auth")}
          className="bg-black text-white px-8 h-[54px] rounded-2xl font-semibold hover:bg-neutral-900 transition"
        >
          Ir a iniciar sesión
        </button>
      </div>
    </div>
  );
};

export default AccountVerified;