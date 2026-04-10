const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const crearVehiculo = async (req, res) => {
  try {
    // Recibimos 'año' del frontend pero lo guardaremos como 'anio' en la BD
    const { matricula, marca, modelo, año, kilometraje } = req.body;
    const usuarioId = req.user.id; 

    const nuevoVehiculo = await prisma.vehiculo.create({
      data: {
        matricula: matricula,
        marca: marca,
        modelo: modelo,
        anio: parseInt(año), // Mapeo de 'año' a 'anio'
        kilometraje: parseInt(kilometraje),
        usuarioId: usuarioId
      }
    });

    res.status(201).json({ 
      mensaje: 'Vehículo añadido correctamente al garaje', 
      vehiculo: nuevoVehiculo 
    });
  } catch (error) {
    console.error("Error al crear vehículo:", error);
    res.status(500).json({ 
      mensaje: 'No se pudo crear el vehículo', 
      error: error.message 
    });
  }
};

const obtenerMisVehiculos = async (req, res) => {
  try {
    const vehiculos = await prisma.vehiculo.findMany({
      where: { usuarioId: req.user.id }
    });
    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los vehículos' });
  }
};

module.exports = { crearVehiculo, obtenerMisVehiculos };