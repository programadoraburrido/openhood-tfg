const TerminosUso = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 my-8 bg-white rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 font-montserrat">Términos de Uso</h1>
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>Bienvenido a OpenHood. Al acceder y utilizar nuestra plataforma, aceptas los siguientes términos y condiciones.</p>
        <h2 className="text-xl font-semibold text-gray-800 mt-6">1. Uso del Servicio</h2>
        <p>El usuario se compromete a hacer un uso adecuado y lícito de la plataforma, introduciendo datos veraces sobre sus vehículos y reparaciones.</p>
        <h2 className="text-xl font-semibold text-gray-800 mt-6">2. Perito IA</h2>
        <p>El análisis proporcionado por el Perito IA es puramente orientativo y se basa en modelos de lenguaje. OpenHood no se hace responsable de decisiones financieras tomadas exclusivamente en base a estos veredictos.</p>
        <p className="text-sm text-gray-400 mt-8 italic">Última actualización: Mayo de 2026</p>
      </div>
    </div>
  );
};

export default TerminosUso;