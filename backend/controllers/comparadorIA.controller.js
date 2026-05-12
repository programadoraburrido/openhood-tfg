const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Groq = require('groq-sdk');

// Inicializamos Groq con la clave del .env
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const analizarPresupuesto = async (req, res) => {
  try {
    const { id } = req.params; 

    // 1. Buscamos el presupuesto
    const presupuesto = await prisma.presupuesto.findUnique({
      where: { id: parseInt(id) },
      include: {
        reparacion: {
          include: { vehiculo: true } 
        }
      }
    });

    if (!presupuesto) {
      return res.status(404).json({ error: 'Presupuesto no encontrado en la base de datos' });
    }

    // 2. Preparamos el Prompt
    const marca = presupuesto.reparacion.vehiculo.marca;
    const modelo = presupuesto.reparacion.vehiculo.modelo;
    const averia = presupuesto.reparacion.descripcion;
    const total = presupuesto.importe_total;

    const promptText = `
      Eres un perito mecánico cínico en España. 
      Tengo un presupuesto para reparar un coche ${marca} ${modelo}.
      La reparación consiste en: "${averia}".
      El taller me pide un total de ${total}€ (impuestos incluidos).
      Actúa como un asesor para el usuario: ¿Consideras que este precio es justo, barato o demasiado caro según el mercado actual? 
      Responde de forma directa y concisa, con un lenguaje profesional pero cercano, en un máximo de 2 o 3 párrafos cortos.
    `;

    // 3. Llamamos a Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: promptText,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const respuestaIA = chatCompletion.choices[0]?.message?.content || "No se pudo generar una respuesta.";

    // 4. Devolvemos el análisis al frontend
    res.json({ 
      coche: `${marca} ${modelo}`,
      averia: averia,
      precio_analizado: `${total}€`,
      veredicto_ia: respuestaIA
    });

  } catch (error) {
    console.error("Error conectando con Groq:", error);
    res.status(500).json({ error: 'Error al generar el análisis comparativo' });
  }
};

module.exports = {
  analizarPresupuesto
};