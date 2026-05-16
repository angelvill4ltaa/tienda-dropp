import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import {
  CheckCircle2,
  Package,
  Truck,
  Home,
  ReceiptText,
  Mail,
  MapPin,
  ShoppingBag,
  Download,
} from "lucide-react";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("pedido");
    if (saved) {
      setData(JSON.parse(saved));
      localStorage.removeItem("pedido");
    }
  }, []);

  const generarPDF = async () => {
  if (!data) return;

  const doc = new jsPDF();
  let y = 20;

  // Convertir imagen a base64 desde ruta
  const getBase64 = (imgPath) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imgPath;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL("image/png"));
      };

      img.onerror = reject;
    });
  };

  // =====================
  // LOGO
  // =====================
  try {
    const logoBase64 = await getBase64("/assets/logo.png");
    doc.addImage(logoBase64, "PNG", 150, 10, 40, 20);
  } catch (e) {
    console.log("Logo error", e);
  }

  // HEADER
  doc.setFontSize(18);
  doc.text("BOLETA DE COMPRA", 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.text(`Orden #${id}`, 20, y);
  y += 6;
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, y);
  y += 10;

  // CLIENTE
  doc.text("DATOS DEL CLIENTE", 20, y);
  y += 6;
  doc.text(`Nombre: ${data.cliente.nombre}`, 20, y);
  y += 5;
  doc.text(`DNI: ${data.cliente.dni}`, 20, y);
  y += 5;
  doc.text(`Correo: ${data.cliente.correo}`, 20, y);
  y += 5;
  doc.text(`Dirección: ${data.cliente.direccion}`, 20, y);
  y += 10;

  // PRODUCTOS
  doc.text("PRODUCTOS", 20, y);
  y += 10;

  for (const p of data.productos) {
    try {
      const imgPath = `/assets/${p.imagen}`; 
      const base64 = await getBase64(imgPath);

      doc.addImage(base64, "PNG", 20, y, 15, 15);
    } catch (e) {
      console.log("Imagen producto error", e);
    }

    doc.text(p.nombre, 40, y + 5);
    doc.text(`x${p.cantidad}`, 40, y + 10);
    doc.text(`S/ ${(p.precio * p.cantidad).toFixed(2)}`, 150, y + 8);

    y += 20;
  }

  // TOTALES
  y += 5;
  doc.line(20, y, 180, y);
  y += 8;

  doc.text(`Envío: S/ ${data.envioCosto}`, 20, y);
  y += 6;

  doc.setFontSize(12);
  doc.text(`TOTAL: S/ ${data.total.toFixed(2)}`, 20, y);

  // FOOTER
  y += 10;
  doc.setFontSize(9);
  doc.text("Gracias por tu compra", 20, y);

  doc.save(`boleta_${id}.pdf`);
};

  if (!data) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">

  <main className="flex-grow px-6 py-14 flex items-center justify-center">
    <div className="w-full max-w-5xl space-y-10">

      {/* HERO SUCCESS */}
      <div className="relative bg-white rounded-3xl p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden">

        {/* Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-green-500/10 blur-3xl rounded-full"></div>

        <CheckCircle2 className="text-green-600 mx-auto mb-4" size={56} />

        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Pago confirmado
        </h1>

        <p className="text-gray-500 mb-6">
          Gracias por tu compra. Estamos procesando tu pedido.
        </p>

        <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm">
          <ReceiptText size={16} /> Orden #{id}
        </div>

        {/* TIMELINE */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">

          {[
            { icon: CheckCircle2, label: "Pago realizado", active: true },
            { icon: Package, label: "Preparando pedido" },
            { icon: Truck, label: "En camino" },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-2 relative">

              <div className={`w-12 h-12 flex items-center justify-center rounded-full
                ${step.active ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400"}
              `}>
                <step.icon size={20} />
              </div>

              <p className={`text-sm font-medium
                ${step.active ? "text-black" : "text-gray-400"}
              `}>
                {step.label}
              </p>

            </div>
          ))}

        </div>
      </div>

      {/* PRODUCTOS */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">

        <h2 className="font-semibold mb-6 flex items-center gap-2 text-lg">
          <ShoppingBag size={18} /> Resumen de compra
        </h2>

        <div className="space-y-4">
          {data.productos.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition"
            >

              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src={`/assets/${p.imagen}`}
                  className="w-full h-full object-contain p-2"
                  alt={p.nombre}
                />
              </div>

              <div className="flex-1">
                <p className="font-medium">{p.nombre}</p>
                <p className="text-xs text-gray-400">
                  x{p.cantidad} {p.size && `• ${p.size}`}
                </p>
              </div>

              <p className="font-semibold">
                S/ {(p.precio * p.cantidad).toFixed(2)}
              </p>

            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="mt-6 pt-4 border-t text-sm space-y-2">
          <div className="flex justify-between text-gray-500">
            <span>Envío</span>
            <span>S/ {data.envioCosto}</span>
          </div>

          <div className="flex justify-between font-bold text-xl">
            <span>Total</span>
            <span>S/ {data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* INFO */}
      <div className="grid md:grid-cols-2 gap-4">

        <div className="bg-white p-5 rounded-2xl flex items-center gap-3 shadow-sm">
          <Mail size={18} className="text-gray-600" />
          <p className="text-sm">
            Confirmación enviada a <span className="font-medium">{data.cliente.correo}</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl flex items-center gap-3 shadow-sm">
          <MapPin size={18} className="text-gray-600" />
          <p className="text-sm">
            Entrega estimada 24 - 72h
          </p>
        </div>

      </div>

      {/* BOTONES */}
      <div className="flex flex-wrap gap-4 justify-center">

        <button
          onClick={generarPDF}
          className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-900 active:scale-[0.97] transition"
        >
          <Download size={16} />
          Descargar boleta
        </button>

        <button
          onClick={() => navigate("/")}
          className="border px-6 py-3 rounded-xl hover:bg-gray-100 transition"
        >
          Inicio
        </button>

        <button
          onClick={() => navigate("/zapatillas")}
          className="text-gray-600 hover:text-black transition"
        >
          Seguir comprando →
        </button>

      </div>

    </div>
  </main>

  <Footer />
</div>
  );
};

export default OrderSuccess;