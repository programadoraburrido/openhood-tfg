import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getTalleres = async (req, res) => {
    try {
        const { nombre } = req.query; // Para buscadores
        const talleres = await prisma.taller.findMany({
            where: {
                nombre: {
                    contains: nombre || '',
                }
            }
        });
        res.json(talleres);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener talleres" });
    }
};

export const createTaller = async (req, res) => {
    try {
        const nuevoTaller = await prisma.taller.create({
            data: req.body
        });
        res.status(201).json(nuevoTaller);
    } catch (error) {
        res.status(400).json({ error: "Error al crear taller" });
    }
};