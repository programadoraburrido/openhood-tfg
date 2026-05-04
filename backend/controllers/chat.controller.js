import { PrismaClient } from '@prisma/client';
import { generarRespuestaMecanico } from '../services/chatbot.service.js';

const prisma = new PrismaClient();

export const handleChat = async (req, res) => {
    const { contenido, usuarioId, vehiculoMatricula } = req.body;

    try {
        // 1. Validar integridad de la matrícula y obtener datos del coche
        let matriculaSegura = null;
        let datosCoche = null;

        if (vehiculoMatricula) {
            datosCoche = await prisma.vehiculo.findUnique({
                where: { matricula: vehiculoMatricula }
            });
            
            if (datosCoche) {
                matriculaSegura = vehiculoMatricula;
            } else {
                console.warn(`⚠️ La matrícula ${vehiculoMatricula} no existe en la BD.`);
            }
        }

        // 2. Recuperar historial previo (últimos 6 mensajes)
        const historialPrevio = await prisma.mensaje.findMany({
            where: { usuarioId: parseInt(usuarioId) },
            orderBy: { fecha: 'asc' },
            take: 6
        });

        // 3. Guardar el mensaje del usuario en la base de datos
        await prisma.mensaje.create({
            data: {
                contenido,
                rol: 'user',
                usuarioId: parseInt(usuarioId),
                vehiculoMatricula: matriculaSegura
            }
        });

        // 4. Generar respuesta de la IA pasándole los datos del coche
        const respuestaIA = await generarRespuestaMecanico(historialPrevio, contenido, datosCoche);

        // 5. Guardar la respuesta de la IA
        const mensajeAsistente = await prisma.mensaje.create({
            data: {
                contenido: respuestaIA,
                rol: 'assistant',
                usuarioId: parseInt(usuarioId),
                vehiculoMatricula: matriculaSegura
            }
        });

        // 6. Enviar al Frontend
        res.status(200).json(mensajeAsistente);

    } catch (error) {
        console.error("❌ Error en persistencia de chat:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getChatHistory = async (req, res) => {
    const { usuarioId } = req.params;

    try {
        const historial = await prisma.mensaje.findMany({
            where: { usuarioId: parseInt(usuarioId) },
            orderBy: { fecha: 'asc' }
        });
        res.json(historial);
    } catch (error) {
        console.error("❌ Error al recuperar historial:", error);
        res.status(500).json({ error: "No se pudo recuperar el historial" });
    }
};