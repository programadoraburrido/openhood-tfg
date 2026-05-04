const Footer = () => {
  return (
    // Fondo blanco, texto gris oscuro para lectura cómoda y un borde superior sutil
    <footer className="bg-white text-gray-600 py-8 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Zona Izquierda: Marca y Copyright */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold font-montserrat text-black text-base tracking-tight">
            Openhood
          </span>
          <span>&copy; {new Date().getFullYear()}. Todos los derechos reservados.</span>
        </div>

        {/* Zona Derecha: Enlaces Legales */}
        <div className="flex gap-6 text-sm font-medium">
          {/* Al hacer hover, se pintan del mismo azul que el enlace de la Navbar */}
          <a href="/politica-privacidad" className="hover:text-blue-600 transition">Política de Privacidad</a>
          <a href="/terminos-uso" className="hover:text-blue-600 transition">Términos de Uso</a>
          <a href="/aviso-legal" className="hover:text-blue-600 transition">Aviso Legal</a>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;