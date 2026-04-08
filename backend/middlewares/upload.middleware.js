const multer = require('multer');
const path = require('path');

// Configuramos dónde y cómo se guardan los archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Carpeta de destino
  },
  filename: function (req, file, cb) {
    // Generamos un nombre único para que no se sobrescriban PDFs con el mismo nombre
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'presupuesto-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro opcional: solo aceptar PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Formato no válido. Solo se permiten PDFs.'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;