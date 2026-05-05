import { Groq } from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const generarRespuestaMecanico = async (historial, mensajeUsuario, datosVehiculo = null) => {
    try {
        // 1. Construcción del contexto del vehículo (Tu lógica mejorada)
        let contextoVehiculo = "El usuario no tiene un vehículo seleccionado en este momento.";
        
        if (datosVehiculo) {
            contextoVehiculo = `El usuario está consultando sobre su vehículo:
            - Marca: ${datosVehiculo.marca}
            - Modelo: ${datosVehiculo.modelo}
            - Año: ${datosVehiculo.anio}
            - Motor/Combustible: ${datosVehiculo.motor || 'No especificado'}
            - Kilometraje: ${datosVehiculo.kilometraje || 'No especificado'} km.`;
        }

        // 2. System Prompt refinado
        const systemPrompt = {
            role: "system",
            content: `Eres un experto mecánico virtual de OpenHood. 
            ${contextoVehiculo}
            Instrucciones:
            1. Si los datos del vehículo están presentes, úsalos para dar respuestas específicas (ej. tipo de aceite, intervalos de mantenimiento).
            2. Mantén un tono profesional, cercano y honesto.
            3. Si el problema parece grave, recomienda siempre acudir a un taller físico.
            4. Responde de forma concisa pero útil.
            5. Importante: Responde siempre en español.`
        };

        // 3. Formateo del historial (Mapeo robusto de roles)
        const historialFormateado = historial.map(msg => ({
            role: msg.rol === 'user' ? 'user' : 'assistant',
            content: msg.contenido
        }));

        // 4. Llamada a Groq con el modelo Llama 3.3 70B
        const completion = await groq.chat.completions.create({
            messages: [
                systemPrompt,
                ...historialFormateado,
                { role: "user", content: mensajeUsuario },
            ],
            model: "llama-3.3-70b-versatile", 
            temperature: 0.6, // Un poco menos de temperatura para respuestas más técnicas y precisas
            max_tokens: 500,  // Evita respuestas excesivamente largas
        });

        return completion.choices[0]?.message?.content || "Lo siento, no he podido procesar tu consulta.";
    } catch (error) {
        console.error("❌ Error en Groq Service:", error);
        // Retornamos un mensaje amigable en lugar de lanzar un error que tumbe el backend
        return "Lo siento, tengo problemas para conectar con mi cerebro mecánico. Inténtalo de nuevo en un momento.";
    }
};