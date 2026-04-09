const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, telefono, password } = req.body;

    // 1. Comprobuebo si el email ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: email }
    });

    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

    // 2. Encriptado de  la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // 3. Guardamos en MySQL
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        telefono,
        password: passwordEncriptada,
      }
    });

    // 4. Respuesta de  éxito (sin devolver el password)
    res.status(201).json({
      mensaje: 'Usuario registrado con éxito',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email
      }
    });

  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

module.exports = { registrarUsuario };