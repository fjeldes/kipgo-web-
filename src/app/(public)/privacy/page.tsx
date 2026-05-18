export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-headline font-extrabold mb-8" style={{ color: '#000666' }}>Política de Privacidad</h1>
      <p className="text-sm mb-8" style={{ color: '#767683' }}>Última actualización: Junio 2026</p>
      <div className="space-y-6 text-sm leading-relaxed" style={{ color: '#454652' }}>

        <section>
          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: '#000666' }}>1. Identidad del Responsable</h2>
          <p>KipGo SpA, sociedad chilena, RUT pendiente, domicilio en Santiago, Chile. Correo electrónico del Delegado de Protección de Datos: <a href="mailto:privacy@kipgo.app" className="underline" style={{ color: '#000666' }}>privacy@kipgo.app</a>.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: '#000666' }}>2. Información que Recopilamos</h2>
          <p>Recopilamos información proporcionada directamente por el Usuario: nombre completo, correo electrónico, número de teléfono, datos de perfil e información de facturación. También recopilamos automáticamente: tipo de dispositivo, dirección IP, ubicación geográfica aproximada, historial de reservas y uso de la aplicación.</p>
          <p className="mt-4">Los pagos son procesados por Stripe, Inc. KipGo no almacena números completos de tarjetas de crédito ni datos bancarios sensibles.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: '#000666' }}>3. Finalidad del Tratamiento</h2>
          <p>Sus datos personales serán tratados para procesar y gestionar reservas y pagos, enviar confirmaciones y notificaciones, proveer soporte al cliente, mejorar la experiencia del usuario, cumplir con obligaciones legales y prevenir fraudes.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: '#000666' }}>4. Base Legal</h2>
          <p>El tratamiento de sus datos se basa en la ejecución del contrato de servicios (Ley N° 19.628), su consentimiento explícito, el interés legítimo de KipGo y obligaciones legales aplicables.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: '#000666' }}>5. Destinatarios de los Datos</h2>
          <p>Compartimos sus datos únicamente con: Anfitriones/tiendas (datos necesarios para procesar la reserva), Stripe (procesamiento de pagos), Resend (envío de correos), Google Cloud Platform (alojamiento) y Expo (notificaciones push). No vendemos su información personal a terceros bajo ninguna circunstancia.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: '#000666' }}>6. Plazos de Conservación</h2>
          <p>Conservamos sus datos mientras su cuenta esté activa y durante 3 años después de su última actividad. Los datos de pago se conservan según los plazos establecidos por la legislación tributaria chilena.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: '#000666' }}>7. Derechos del Titular (Ley N° 19.628)</h2>
          <p>Usted tiene derecho a acceder, rectificar, cancelar y oponerse al tratamiento de sus datos. Para ejercer estos derechos, envíe un correo a <a href="mailto:privacy@kipgo.app" className="underline" style={{ color: '#000666' }}>privacy@kipgo.app</a> con el asunto &quot;Derechos ARCO&quot;. Responderemos dentro de los 15 días hábiles.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: '#000666' }}>8. Seguridad de los Datos</h2>
          <p>Implementamos cifrado AES-256 para datos en reposo, TLS 1.3 para datos en tránsito, autenticación de dos factores para accesos administrativos y auditorías periódicas de seguridad.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: '#000666' }}>9. Contacto</h2>
          <p>Consultas de privacidad: <a href="mailto:privacy@kipgo.app" className="underline" style={{ color: '#000666' }}>privacy@kipgo.app</a></p>
          <p>Consultas legales: <a href="mailto:legal@kipgo.app" className="underline" style={{ color: '#000666' }}>legal@kipgo.app</a></p>
        </section>

      </div>
    </div>
  );
}
