const AvisoLegal = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 my-8 bg-white rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 font-montserrat">Aviso Legal</h1>
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <h2 className="text-xl font-semibold text-gray-800 mt-6">1. Información General</h2>
        <p>En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa que esta plataforma es un proyecto académico (TFG).</p>
        <h2 className="text-xl font-semibold text-gray-800 mt-6">2. Propiedad Intelectual</h2>
        <p>El código fuente, los diseños gráficos, las imágenes, las fotografías, los sonidos, las animaciones, el software, los textos, así como la información y los contenidos que se recogen en OpenHood están protegidos por la legislación española sobre los derechos de propiedad intelectual.</p>
      </div>
    </div>
  );
};

export default AvisoLegal;