const PoliticaPrivacidad = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 my-8 bg-white rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 font-montserrat">Política de Privacidad</h1>
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>En OpenHood nos tomamos muy en serio la privacidad de tus datos y los de tus vehículos.</p>
        <h2 className="text-xl font-semibold text-gray-800 mt-6">1. Datos que recopilamos</h2>
        <p>Recopilamos información básica para el funcionamiento del servicio, como la matrícula de los vehículos, historial de reparaciones y presupuestos asociados.</p>
        <h2 className="text-xl font-semibold text-gray-800 mt-6">2. Uso de la información</h2>
        <p>Los datos introducidos en la plataforma se utilizan exclusivamente para proporcionar el servicio de gestión de flota y realizar análisis a través de nuestro Perito IA.</p>
        <p className="text-sm text-gray-400 mt-8 italic">Última actualización: Mayo de 2026</p>
      </div>
    </div>
  );
};

export default PoliticaPrivacidad;