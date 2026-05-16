import { Mail, Phone, MapPin } from "lucide-react";
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

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-12">

        <div>
          <h2 className="text-3xl font-bold text-white mb-4">
            DROPP
          </h2>

          <button
            onClick={() => navigate("/auth")}
            className="mt-6 bg-neutral-900 text-white border border-neutral-700 px-4 py-2.5 rounded-2xl text-sm font-medium"
          >
            Únete a DROPP 
          </button>

          <div className="flex gap-4 mt-7">
            {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
              <div
                key={i}
                className="w-9 h-9 border border-gray-700 rounded-full flex items-center justify-center"
              >
                <Icon size={14} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-white text-sm font-semibold mb-5">
            Explorar
          </h3>

          <ul className="space-y-4 text-sm">
            {exploreLinks.map((item, i) => (
              <li
                key={i}
                onClick={() => navigate(item.path)}
                className="cursor-pointer"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white text-sm font-semibold mb-5">
            Soporte
          </h3>

          <ul className="space-y-4 text-sm">
            {supportLinks.map((item, i) => (
              <li
                key={i}
                className="cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>

          <div
            onClick={() => navigate("/reclamaciones")}
            className="mt-6 flex items-center border border-gray-800 rounded-lg px-3 py-3 max-w-[230px]"
          >
            <div className="w-12 flex justify-center">
              <img
                src="/assets/Libro.jpg"
                alt="Libro"
                className="h-9 object-contain"
              />
            </div>
   
              <p className="text-white text-sm font-medium">
                Libro de reclamaciones
              </p>           
          </div>
        </div>

        <div>
          <h3 className="text-white text-sm font-semibold mb-5">
            Contacto
          </h3>

          <div className="space-y-4 text-sm">
            <p className="flex items-center gap-3">
              <MapPin size={16} /> Lima, Perú
            </p>

            <p className="flex items-center gap-3">
              <Phone size={16} /> +51 999 999 999
            </p>

            <p className="flex items-center gap-3">
              <Mail size={16} /> dropp@tienda.com
            </p>
          </div>

          <div className="mt-8">
            <p className="text-white text-sm font-medium mb-3">
              Medios de pago
            </p>

            <div className="flex items-center gap-5">
              <SiVisa className="text-3xl" />
              <SiMastercard className="text-3xl" />
              <img
                src="/assets/yape.png"
                alt="Yape"
                className="h-6"
              />
            </div>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-6 text-xs text-gray-500">

          <p>© {new Date().getFullYear()} DROPP — Todos los derechos reservados</p>

        </div>
      </div>

    </footer>
  );
};

export default Footer;