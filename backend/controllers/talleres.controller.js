const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTalleres = async (req, res) => {
  try {
    const talleres = await prisma.taller.findMany();
    res.json(talleres);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los talleres" });
  }
};

const getTalleresCercanos = async (req, res) => {
  const { lat, lng, radio = 10 } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitud y longitud son requeridas" });
  }

  try {
    const todos = await prisma.taller.findMany();
    const cercanos = todos.filter(taller => {
      const R = 6371;
      const dLat = (taller.latitud - lat) * (Math.PI / 180);
      const dLng = (taller.longitud - lng) * (Math.PI / 180);
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat * (Math.PI / 180)) * Math.cos(taller.latitud * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distancia = R * c;
      return distancia <= parseFloat(radio);
    });
    res.json(cercanos);
  } catch (error) {
    res.status(500).json({ error: "Error al calcular cercanía" });
  }
};

const createTaller = async (req, res) => {
  const { nombre, direccion, latitud, longitud, telefono, email, descripcion } = req.body;
  try {
    const nuevoTaller = await prisma.taller.create({
      data: {
        nombre,
        direccion,
        latitud: parseFloat(latitud),
        longitud: parseFloat(longitud),
        telefono,
        email,
        descripcion
      }
    });
    res.status(201).json(nuevoTaller);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el taller" });
  }
};

// Exportación con CommonJS
module.exports = {
  getTalleres,
  getTalleresCercanos,
  createTaller
};