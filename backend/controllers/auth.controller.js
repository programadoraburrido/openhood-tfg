const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, telefono, password } = req.body;
    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });

    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    const nuevoUsuario = await prisma.usuario.create({
      data: { nombre, email, telefono, password: passwordEncriptada }
    });

    res.status(201).json({
      mensaje: 'Usuario registrado con éxito',
      usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el registro' });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET || 'clave_secreta_openhood_2026',
      { expiresIn: '24h' }
    );

    res.json({ mensaje: 'Login exitoso', token, usuario: { id: usuario.id, nombre: usuario.nombre } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el login' });
  }
};

module.exports = { registrarUsuario, loginUsuario };