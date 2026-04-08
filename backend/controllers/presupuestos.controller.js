const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Crear presupuesto en base a un id de reparacion
const crearPresupuesto = async (req, res) => {
  try {
    
    const { base_imponible, reparacionId } = req.body;

    if (!base_imponible || !reparacionId) {
      return res.status(400).json({ error: 'Faltan datos obligatorios: base_imponible o reparacionId' });
    }

    const porcentajeIva = 0.21;
    const calculoIva = base_imponible * porcentajeIva;
    const importeTotal = base_imponible + calculoIva;

    const nuevoPresupuesto = await prisma.presupuesto.create({
      data: {
        base_imponible: base_imponible,
        IVA: Number(calculoIva.toFixed(2)),
        importe_total: Number(importeTotal.toFixed(2)),
        reparacionId: reparacionId
      },
    });

    res.status(201).json(nuevoPresupuesto);
  } catch (error) {
    console.error("Error creando presupuesto:", error);
    res.status(500).json({ error: 'Error al crear el presupuesto en la base de datos' });
  }
};

// 2. Obtener presupuestos 
const obtenerPresupuestos = async (req, res) => {
  try {
    const presupuestos = await prisma.presupuesto.findMany({
      include: {
        reparacion: true
      }
    });
    res.json(presupuestos);
  } catch (error) {
    console.error("Error obteniendo presupuestos:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 3. Actualizar presupuesto.
const actualizarPresupuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const { base_imponible } = req.body;

    // Validamos que nos envíen la nueva base imponible
    if (base_imponible === undefined) {
      return res.status(400).json({ error: 'Debes proporcionar una nueva base_imponible' });
    }

    // Volvemos a calcular los impuestos con el nuevo precio
    const porcentajeIva = 0.21;
    const calculoIva = base_imponible * porcentajeIva;
    const importeTotal = base_imponible + calculoIva;

    const presupuestoActualizado = await prisma.presupuesto.update({
      where: { id: parseInt(id) },
      data: {
        base_imponible: base_imponible,
        IVA: Number(calculoIva.toFixed(2)),
        importe_total: Number(importeTotal.toFixed(2)),
      },
    });

    res.json(presupuestoActualizado);
  } catch (error) {
    console.error("Error actualizando presupuesto:", error);
    res.status(500).json({ error: 'Error al actualizar el presupuesto (¿Existe el ID?)' });
  }
};

// 4. Borrar presupuesto por id
const eliminarPresupuesto = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.presupuesto.delete({
      where: { id: parseInt(id) },
    });

    res.json({ mensaje: `Presupuesto con ID ${id} eliminado correctamente` });
  } catch (error) {
    console.error("Error eliminando presupuesto:", error);
    res.status(500).json({ error: 'Error al eliminar el presupuesto' });
  }
};

// 5. Subir PDF del presupuesto
const subirPdf = async (req, res) => {
  try {
    const { id } = req.params;

    // Si el middleware de Multer no ha procesado ningún archivo salta error 400
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo PDF' });
    }

    // Creamos la ruta pública que guardaremos en la BD
    const urlPdf = `/uploads/${req.file.filename}`;

    const presupuestoActualizado = await prisma.presupuesto.update({
      where: { id: parseInt(id) },
      data: { url_pdf: urlPdf },
    });

    res.json({
      mensaje: 'PDF subido y vinculado correctamente',
      presupuesto: presupuestoActualizado
    });
  } catch (error) {
    console.error("Error al vincular el PDF:", error);
    res.status(500).json({ error: 'Error interno al guardar el documento' });
  }
};


module.exports = {
  crearPresupuesto,
  obtenerPresupuestos,
  actualizarPresupuesto,
  eliminarPresupuesto,
  subirPdf
};