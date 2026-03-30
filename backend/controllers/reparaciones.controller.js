const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Obtener todas las reparaciones (El GET que teníamos en index.js)
const obtenerReparaciones = async (req, res) => {
  try {
    const reparaciones = await prisma.reparacion.findMany({
      // Aquí incluiremos las relaciones más adelante si las necesitas
    });
    res.json(reparaciones);
  } catch (error) {
    console.error("Error obteniendo reparaciones:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 2. Crear una nueva reparación (El POST nuevo)
const crearReparacion = async (req, res) => {
  try {
    // req.body contiene el JSON que enviaremos desde el frontend (o Postman)
    const datosReparacion = req.body; 

    const nuevaReparacion = await prisma.reparacion.create({
      data: datosReparacion,
    });

    // 201 significa "Creado con éxito"
    res.status(201).json(nuevaReparacion);
  } catch (error) {
    console.error("Error creando reparación:", error);
    res.status(500).json({ error: 'Error al crear la reparación en la base de datos' });
  }
};

// Exportamos las funciones para poder usarlas en las rutas
module.exports = {
  obtenerReparaciones,
  crearReparacion
};