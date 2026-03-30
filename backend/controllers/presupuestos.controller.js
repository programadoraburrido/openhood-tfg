const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const crearPresupuesto = async (req, res) => {
  try {
    const datosPresupuesto = req.body;

    const nuevoPresupuesto = await prisma.presupuesto.create({
      data: datosPresupuesto,
    });

    res.status(201).json(nuevoPresupuesto);
  } catch (error) {
    console.error("Error creando presupuesto:", error);
    // Si da error, a menudo es porque el reparacionId no existe o ya tiene un presupuesto
    res.status(500).json({ error: 'Error al crear el presupuesto en la base de datos' });
  }
};

const obtenerPresupuestos = async (req, res) => {
  try {
    const presupuestos = await prisma.presupuesto.findMany({
      include: {
        reparacion: true // ¡Magia de Prisma! Nos trae los datos de la reparación asociada
      }
    });
    res.json(presupuestos);
  } catch (error) {
    console.error("Error obteniendo presupuestos:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  crearPresupuesto,
  obtenerPresupuestos
};