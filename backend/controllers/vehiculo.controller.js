const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREAR
const crearVehiculo = async (req, res) => {
  try {
    const { matricula, marca, modelo, año, kilometraje } = req.body;
    const nuevoVehiculo = await prisma.vehiculo.create({
      data: {
        matricula,
        marca,
        modelo,
        anio: parseInt(año),
        kilometraje: parseInt(kilometraje),
        usuarioId: req.user.id
      }
    });
    res.status(201).json({ mensaje: 'Vehículo añadido', vehiculo: nuevoVehiculo });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear', error: error.message });
  }
};

// LISTAR TODOS LOS DEL USUARIO
const obtenerMisVehiculos = async (req, res) => {
  try {
    const vehiculos = await prisma.vehiculo.findMany({
      where: { usuarioId: req.user.id }
    });
    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener vehículos' });
  }
};

// VER UNO SOLO (POR MATRÍCULA)
const obtenerVehiculoPorMatricula = async (req, res) => {
  try {
    const vehiculo = await prisma.vehiculo.findFirst({
      where: { 
        matricula: req.params.matricula,
        usuarioId: req.user.id // Seguridad: que sea mío
      }
    });
    if (!vehiculo) return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    res.json(vehiculo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el vehículo' });
  }
};

// BORRAR
const eliminarVehiculo = async (req, res) => {
  try {
    // Verificamos que el coche existe y es del usuario antes de borrar
    const vehiculo = await prisma.vehiculo.findFirst({
      where: { 
        matricula: req.params.matricula,
        usuarioId: req.user.id 
      }
    });

    if (!vehiculo) return res.status(404).json({ mensaje: 'No puedes borrar un coche que no es tuyo o no existe' });

    await prisma.vehiculo.delete({
      where: { matricula: req.params.matricula }
    });

    res.json({ mensaje: 'Vehículo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar. Puede que tenga reparaciones asociadas.' });
  }
};
// ACTUALIZAR (UPDATE)
const actualizarVehiculo = async (req, res) => {
  try {
    const { marca, modelo, año, kilometraje } = req.body;
    const { matricula } = req.params;

    // 1. Verificamos si el coche existe y es del usuario
    const vehiculoExistente = await prisma.vehiculo.findFirst({
      where: { 
        matricula: matricula,
        usuarioId: req.user.id 
      }
    });

    if (!vehiculoExistente) {
      return res.status(404).json({ mensaje: 'No puedes editar un vehículo que no te pertenece o no existe' });
    }

    // 2. Actualizamos
    const vehiculoActualizado = await prisma.vehiculo.update({
      where: { matricula: matricula },
      data: {
        marca: marca || vehiculoExistente.marca,
        modelo: modelo || vehiculoExistente.modelo,
        anio: año ? parseInt(año) : vehiculoExistente.anio,
        kilometraje: kilometraje ? parseInt(kilometraje) : vehiculoExistente.kilometraje
      }
    });

    res.json({ mensaje: 'Vehículo actualizado con éxito', vehiculo: vehiculoActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el vehículo', error: error.message });
  }
};

module.exports = { 
  crearVehiculo, 
  obtenerMisVehiculos, 
  obtenerVehiculoPorMatricula, 
  eliminarVehiculo,
  actualizarVehiculo 
};