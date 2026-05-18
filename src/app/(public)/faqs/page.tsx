'use client';

import { useState } from "react";

const faqs = [
  {
    q: "¿Cómo funciona KipGo?",
    a: "Busca una tienda cercana en el mapa, selecciona la fecha y hora de entrega y recogida, elige tus maletas y paga. Al llegar a la tienda, muestra tu código QR para dejar tu equipaje. Cuando regreses, presenta el mismo código para retirarlo."
  },
  {
    q: "¿Cuánto cuesta?",
    a: "Cada tienda establece sus propios precios. El precio mínimo es de $3.500 CLP para artículos pequeños, $5.000 para medianos y $7.000 para grandes. Al precio se agrega una tarifa de servicio del 15% y el IVA está incluido."
  },
  {
    q: "¿Cómo funcionan las comisiones?",
    a: "Los dueños de tiendas publican el precio que desean recibir. KipGo aplica una comisión del 18% sobre ese precio por uso de la plataforma. Al viajero se le agrega una tarifa de servicio del 15% sobre el precio publicado. Ambos valores se muestran claramente antes de confirmar."
  },
  {
    q: "¿Puedo cancelar o modificar mi reserva?",
    a: "Sí, puedes cancelar antes del check-in con reembolso completo. Las extensiones de tiempo están sujetas a disponibilidad de la tienda y generan cargos adicionales."
  },
  {
    q: "¿Qué artículos puedo almacenar?",
    a: "Maletas, mochilas, bolsos de viaje y artículos personales. No se允许 almacenar: armas, explosivos, sustancias ilegales, alimentos perecederos, animales vivos, dinero en efectivo ni joyas de alto valor no declaradas."
  },
  {
    q: "¿Está asegurado mi equipaje?",
    a: "El dueño de la tienda es responsable directo del cuidado de tu equipaje durante el almacenamiento. En caso de pérdida o daño, el dueño está obligado a compensarte. KipGo no proporciona seguro adicional, pero puedes contratar un seguro de viaje por tu cuenta."
  },
  {
    q: "¿Qué pasa si no retiro mi equipaje a tiempo?",
    a: "Si no retiras tu equipaje en la fecha acordada, se generarán cargos adicionales automáticos. Transcurridos 7 días sin retiro, el equipaje se considerará abandonado y podrá ser dispuesto según la legislación chilena."
  },
  {
    q: "¿Cómo me registro como dueño de tienda?",
    a: "Descarga la app KipGo, crea una cuenta y selecciona la opción 'Conviértete en Socio'. Completa los datos de tu tienda, horarios y precios. Tu tienda será revisada y, una vez aprobada, comenzará a recibir reservas."
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-center gap-4 mb-4">
        <img src="/images/alert.png" alt="" className="w-12 h-12" />
        <h1 className="text-4xl font-headline font-extrabold" style={{ color: '#000666' }}>Preguntas Frecuentes</h1>
      </div>
      <p className="text-sm mb-12" style={{ color: '#767683' }}>Encuentra respuestas a las preguntas más comunes sobre KipGo.</p>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-sm transition-colors hover:opacity-80"
              style={{ color: '#000666' }}
            >
              <span>{faq.q}</span>
              <span className={`material-symbols-outlined transition-transform ${openIndex === i ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
            {openIndex === i && (
              <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: '#454652' }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
