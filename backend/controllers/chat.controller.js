const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const chatbotService = require('../services/chatbot.service');

// 1. Obtener lista de vehículos del usuario
exports.getUserVehicles = async (req, res) => {
    const { usuarioId } = req.params;
    const idLimpio = usuarioId.includes(':') ? usuarioId.split(':')[0] : usuarioId;

    try {
        const vehiculos = await prisma.vehiculo.findMany({
            where: { usuarioId: parseInt(idLimpio) }
        });
        res.json(vehiculos);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error al obtener vehículos" });
    }
};

// 2. Manejar el flujo de chat
exports.handleChat = async (req, res) => {
    const { contenido, usuarioId, vehiculoMatricula } = req.body;

    try {
        // Buscamos los datos técnicos del coche actual para la IA
        let datosCoche = null;
        if (vehiculoMatricula) {
            datosCoche = await prisma.vehiculo.findUnique({
                where: { matricula: vehiculoMatricula }
            });
        }

        // Recuperamos el historial de este usuario
        const historialPrevio = await prisma.mensaje.findMany({
            where: { usuarioId: parseInt(usuarioId) },
            orderBy: { fecha: 'asc' },
            take: 10
        });

        // Guardar mensaje del usuario
        await prisma.mensaje.create({
            data: {
                contenido,
                rol: 'user',
                usuarioId: parseInt(usuarioId),
                vehiculoMatricula: vehiculoMatricula
            }
        });

        // Llamada al servicio de IA (Groq) con los datos del coche actual
        const respuestaIA = await chatbotService.generarRespuestaMecanico(historialPrevio, contenido, datosCoche);

        // Guardar respuesta de la IA
        const mensajeAsistente = await prisma.mensaje.create({
            data: {
                contenido: respuestaIA,
                rol: 'assistant',
                usuarioId: parseInt(usuarioId),
                vehiculoMatricula: vehiculoMatricula
            }
        });

        res.status(200).json(mensajeAsistente);
    } catch (error) {
        console.error("Error en chat:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

// 3. Obtener historial
exports.getChatHistory = async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const historial = await prisma.mensaje.findMany({
            where: { usuarioId: parseInt(usuarioId) },
            orderBy: { fecha: 'asc' }
        });
        res.json(historial);
    } catch (error) {
        res.status(500).json({ error: "Error al cargar historial" });
    }
};