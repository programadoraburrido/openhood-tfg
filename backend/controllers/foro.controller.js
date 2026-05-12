const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Función 1: Obtener todos los temas
const obtenerTemas = async (req, res) => {
  try {
    const temas = await prisma.foroTema.findMany({
      include: {
        usuario: { select: { nombre: true } },
        _count: { select: { respuestas: true } }
      },
      orderBy: { fecha_creacion: 'desc' }
    });
    res.json(temas);
  } catch (error) {
    console.error("Error cargando el foro:", error);
    res.status(500).json({ error: 'No se pudieron cargar los temas del foro.' });
  }
};

// Función 2: Crear un nuevo tema
const crearTema = async (req, res) => {
  // 🚨 Eliminamos usuarioId de aquí
  const { titulo, contenido, categoria } = req.body; 
  try {
    const nuevoTema = await prisma.foroTema.create({
      data: {
        titulo,
        contenido,
        categoria,
        // 🚨 Usamos req.user.id (viene del token de seguridad)
        usuarioId: req.user.id 
      }
    });
    res.status(201).json(nuevoTema);
  } catch (error) {
    console.error("Error creando tema:", error);
    res.status(500).json({ error: 'Hubo un error al publicar tu tema.' });
  }
};

// Función 3: Obtener un solo tema con sus respuestas
const obtenerTemaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const tema = await prisma.foroTema.findUnique({
      where: { id: parseInt(id) },
      include: {
        usuario: { select: { nombre: true } },
        respuestas: {
          include: { usuario: { select: { nombre: true } } },
          orderBy: { fecha_creacion: 'asc' }
        }
      }
    });

    if (!tema) return res.status(404).json({ error: 'Tema no encontrado' });
    res.json(tema);
  } catch (error) {
    console.error("Error cargando el tema:", error);
    res.status(500).json({ error: 'Error al cargar el tema.' });
  }
};

// Función 4: Crear una respuesta a un tema
const crearRespuesta = async (req, res) => {
  const { id } = req.params; // ID del tema
  // 🚨 Eliminamos usuarioId de aquí también
  const { contenido } = req.body; 
  try {
    const nuevaRespuesta = await prisma.foroRespuesta.create({
      data: {
        contenido,
        temaId: parseInt(id),
        // 🚨 Usamos req.user.id de nuevo
        usuarioId: req.user.id 
      },
      include: { usuario: { select: { nombre: true } } }
    });
    res.status(201).json(nuevaRespuesta);
  } catch (error) {
    console.error("Error creando respuesta:", error);
    res.status(500).json({ error: 'No se pudo publicar la respuesta.' });
  }
};

module.exports = {
  obtenerTemas,
  crearTema,
  obtenerTemaPorId,
  crearRespuesta
};