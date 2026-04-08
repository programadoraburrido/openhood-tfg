const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 2. Obtener todas las reparaciones (El GET que teníamos en index.js)
const obtenerReparaciones = async (req, res) => {
  try {
    const reparaciones = await prisma.reparacion.findMany({

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

// 3. Actualizar una reparación existente (PUT)
const actualizarReparacion = async (req, res) => {
  try {
    // Extraemos el ID directamente de la URL (ej. /api/reparaciones/5)
    const { id } = req.params; 
    const datosNuevos = req.body;

    const reparacionActualizada = await prisma.reparacion.update({
      where: { id: parseInt(id) }, // Prisma necesita que el ID sea un número entero
      data: datosNuevos,
    });

    res.json(reparacionActualizada);
  } catch (error) {
    console.error("Error actualizando reparación:", error);
    res.status(500).json({ error: 'Error al actualizar la reparación.' });
  }
};

// 4. Eliminar una reparación (DELETE)
const eliminarReparacion = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.reparacion.delete({
      where: { id: parseInt(id) },
    });

    res.json({ mensaje: `Reparación con ID ${id} eliminada correctamente` });
  } catch (error) {
    console.error("Error eliminando reparación:", error);
    res.status(500).json({ error: 'Error al eliminar la reparación' });
  }
};

// 5. Obtener reparaciones de un vehículo concreto
const obtenerReparacionesPorVehiculo = async (req, res) => {
  try {
    let { matricula } = req.params;
    matricula = matricula.replace(/\s+/g, '').toUpperCase(); // Quita espacios y pone mayúsculas

    const reparaciones = await prisma.reparacion.findMany({
      where: { 
        vehiculoMatricula: matricula 
      },
      include: {
        presupuesto: true
      },
      orderBy: {
        fecha: 'desc'
      }
    });
 
    // Si se busca y no hay nada, se devuelve un array vacío.
    res.json(reparaciones);
  } catch (error) {
    console.error("Error obteniendo reparaciones del vehículo:", error);
    res.status(500).json({ error: 'Error al buscar el historial del vehículo' });
  }
};

module.exports = {
  obtenerReparaciones,
  crearReparacion,
  actualizarReparacion,
  eliminarReparacion,
  obtenerReparacionesPorVehiculo

};