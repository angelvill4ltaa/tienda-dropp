import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const exploreLinks = [
    { label: "Inicio", path: "/" },
    { label: "Zapatillas", path: "/zapatillas" },
    { label: "Ropa", path: "/ropa" },
    { label: "Accesorios", path: "/accesorios" },
  ];

  const supportLinks = [
    "Preguntas frecuentes",
    "Cambios y devoluciones",
    "Términos y condiciones",
    "Política de privacidad",
  ];

  return (
    <footer className="bg-black text-gray-400 mt-24">

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

        <div className="md:pr-8">
          <h2 className="text-4xl font-black text-white tracking-tight mb-5">
            DROPP
          </h2>

          <p className="text-sm text-gray-500 leading-7 max-w-xs">
            Moda urbana diseñada para quienes entienden que vestir bien también es una actitud.
          </p>

          <button
            onClick={() => navigate("/auth")}
            className="mt-7 bg-white text-black px-6 py-3 rounded-full font-semibold transition flex items-center gap-2"
          >
            Únete a DROPP <ArrowRight size={15} />
          </button>

          <div className="flex gap-4 mt-7">
            {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border border-gray-700 hover:border-white hover:text-white flex items-center justify-center cursor-pointer transition"
              >
                <Icon size={14} />
              </div>
            ))}
          </div>
        </div>

        {/* EXPLORE */}
        <div>
          <h3 className="text-white text-sm font-semibold uppercase tracking-[0.25em] mb-6">
            Explorar
          </h3>

          <ul className="space-y-4 text-sm">
            {exploreLinks.map((item, i) => (
              <li
                key={i}
                onClick={() => navigate(item.path)}
                className="cursor-pointer hover:text-white transition"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-white text-sm font-semibold uppercase tracking-[0.25em] mb-6">
            Soporte
          </h3>

          <ul className="space-y-4 text-sm">
            {supportLinks.map((item, i) => (
              <li
                key={i}
                className="cursor-pointer hover:text-white transition"
              >
                {item}
              </li>
            ))}
          </ul>

          <div
            onClick={() => navigate("/reclamaciones")}
            className="mt-8 flex items-center border border-gray-800 hover:border-gray-600 rounded-2xl px-3 py-3 cursor-pointer transition group max-w-[240px]"
          >
            <div className="w-12 flex justify-center">
              <img
                src="/assets/Libro.jpg"
                alt="Libro"
                className="h-10 object-contain opacity-80 group-hover:opacity-100 transition"
              />
            </div>

            <div className="flex-1 text-center pr-2">
              <p className="text-white text-sm font-medium leading-tight">
                Libro de reclamaciones
              </p>
           </div>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-white text-sm font-semibold uppercase tracking-[0.25em] mb-6">
            Contacto
          </h3>

          <div className="space-y-4 text-sm">
            <p className="flex items-center gap-3 hover:text-white transition">
              <MapPin size={16} /> Lima, Perú
            </p>

            <p className="flex items-center gap-3 hover:text-white transition">
              <Phone size={16} /> +51 999 999 999
            </p>

            <p className="flex items-center gap-3 hover:text-white transition">
              <Mail size={16} /> dropp@tienda.com
            </p>
          </div>

          <div className="mt-8">
            <p className="text-white text-sm font-medium mb-3">
              Medios de pago
            </p>

            <div className="flex items-center gap-5 text-gray-500">
              <SiVisa className="text-3xl hover:text-white transition" />
              <SiMastercard className="text-3xl hover:text-white transition" />
              <img
                src="/assets/yape.png"
                alt="Yape"
                className="h-7 opacity-80 hover:opacity-100 transition"
              />
            </div>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">

          <p>© {new Date().getFullYear()} DROPP — Todos los derechos reservados</p>

        </div>
      </div>

    </footer>
  );
};

export default Footer;