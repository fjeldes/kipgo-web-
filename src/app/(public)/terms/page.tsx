export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-headline font-extrabold mb-8" style={{ color: '#000666' }}>Términos y Condiciones — Usuario</h1>
      <p className="text-sm mb-8" style={{ color: '#767683' }}>Última actualización: Junio 2026</p>
      <div className="space-y-6 text-sm leading-relaxed" style={{ color: '#454652' }}>

        <section>
          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: '#000666' }}>1. Aceptación de los Términos</h2>
          <p>Al acceder o utilizar la aplicación KipGo (&quot;la Plataforma&quot;), usted acepta cumplir y estar legalmente vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: '#000666' }}>2. Información de KipGo</h2>
          <p>KipGo SpA, sociedad constituida bajo las leyes de la República de Chile, RUT pendiente, domicilio en Santiago, Chile. Correo electrónico de contacto: legal@kipgo.app.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: '#000666' }}>3. Descripción del Servicio</h2>
          <p>KipGo es una plataforma tecnológica que conecta a Usuarios con Anfitriones para el almacenamiento temporal de equipaje. KipGo actúa únicamente como intermediario facilitando las reservas, pagos y comunicación entre las partes. No presta directamente el servicio de almacenamiento ni tiene la custodia del equipaje. La relación contractual para el servicio de almacenamiento se establece directamente entre el Usuario y el Anfitrión.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: '#000666' }}>4. Reservas y Pagos</h2>
          <p>Al realizar una reserva, usted autoriza expresamente el cargo del monto total correspondiente. Todos los precios se muestran en pesos chilenos (CLP) e incluyen el Impuesto al Valor Agregado (IVA) cuando corresponda. El pago se procesa al momento de la reserva a través de Stripe. Al precio publicado por el Anfitrión se le agrega una tarifa de servicio del 15% que KipGo cobra al Usuario por el uso de la Plataforma.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: '#000666' }}>5. Cancelaciones y Reembolsos</h2>
          <p>Cancelaciones realizadas antes del check-in: reembolso completo del monto pagado. Cancelaciones después del check-in: no procede reembolso. El reembolso se procesará dentro de un plazo de 5 a 10 días hábiles.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: '#000666' }}>6. Artículos Prohibidos</h2>
          <p>Queda estrictamente prohibido almacenar: armas, explosivos, sustancias ilegales, alimentos perecederos, animales vivos, dinero en efectivo, joyas, documentos personales originales, y cualquier artículo cuya tenencia sea ilegal según la legislación chilena.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: '#000666' }}>7. Responsabilidad — Exención Total de KipGo</h2>
          <p>KipGo actúa EXCLUSIVAMENTE como facilitador tecnológico. Bajo ninguna circunstancia KipGo presta servicios de almacenamiento, custodia ni tiene la posesión material del equipaje. KIPGO NO ASUME RESPONSABILIDAD ALGUNA POR PÉRDIDA, DAÑO, HURTO O CUALQUIER OTRO PERJUICIO RELACIONADO CON EL EQUIPAJE. El Usuario reconoce que utiliza la Plataforma BAJO SU PROPIO RIESGO.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: '#000666' }}>8. Propiedad Intelectual</h2>
          <p>Todos los derechos de propiedad intelectual sobre la Plataforma son propiedad exclusiva de KipGo. Queda prohibida la reproducción, distribución o modificación no autorizada.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: '#000666' }}>9. Ley Aplicable y Jurisdicción</h2>
          <p>Estos Términos se rigen por las leyes de la República de Chile. Cualquier controversia será sometida a los tribunales ordinarios de justicia de Santiago, Chile.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-10 mb-4" style={{ color: '#000666' }}>10. Contacto</h2>
          <p>Para consultas sobre estos términos: <a href="mailto:legal@kipgo.app" className="underline" style={{ color: '#000666' }}>legal@kipgo.app</a></p>
        </section>

      </div>
    </div>
  );
}
