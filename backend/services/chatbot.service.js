import { Groq } from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const generarRespuestaMecanico = async (historial, mensajeUsuario, datosVehiculo = null) => {
    try {
        // Creamos la "ficha técnica" para que la IA sepa con qué trabaja
        let contextoVehiculo = "El usuario no tiene un vehículo seleccionado en este momento.";
        
        if (datosVehiculo) {
            contextoVehiculo = `El usuario está consultando sobre su vehículo:
            - Marca: ${datosVehiculo.marca}
            - Modelo: ${datosVehiculo.modelo}
            - Año: ${datosVehiculo.anio}
            - Motor/Combustible: ${datosVehiculo.motor || 'No especificado'}
            - Kilometraje: ${datosVehiculo.kilometraje || 'No especificado'} km.`;
        }

        const systemPrompt = {
            role: "system",
            content: `Eres un experto mecánico virtual de OpenHood. 
            ${contextoVehiculo}
            Instrucciones:
            1. Si los datos del vehículo están presentes, úsalos para dar respuestas específicas (ej. tipo de aceite, intervalos de mantenimiento).
            2. Mantén un tono profesional, cercano y honesto.
            3. Si el problema parece grave, recomienda siempre acudir a un taller físico.
            4. Responde de forma concisa pero útil.`
        };

        // Formateamos el historial para que Groq lo entienda
        const historialFormateado = historial.map(msg => ({
            role: msg.rol === 'user' ? 'user' : 'assistant',
            content: msg.contenido
        }));

        const completion = await groq.chat.completions.create({
            messages: [
                systemPrompt,
                ...historialFormateado,
                { role: "user", content: mensajeUsuario },
            ],
            model: "llama-3.3-70b-versatile", // Puedes usar el modelo que prefieras de Groq
        });

        return completion.choices[0]?.message?.content || "Lo siento, no he podido procesar tu consulta.";
    } catch (error) {
        console.error("Error en Groq Service:", error);
        throw new Error("Error al conectar con la IA");
    }
};