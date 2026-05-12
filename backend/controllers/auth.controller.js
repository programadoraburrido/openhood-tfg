const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const registrarUsuario = async (req, res) => {
  try {
    // 1. Primero sacamos los datos del cuerpo
    const { nombre, email, telefono, password } = req.body;

    // 2. Luego validamos que lo que hemos sacado no esté vacío
    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    // 3. Ahora seguimos con la lógica de base de datos
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
const obtenerPerfil = async (req, res) => {
  try {
    // req.user.id viene de tu middleware de autenticación (verificarToken)
    // Asegúrate de que el middleware esté protegiendo esta ruta
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: { id: true, nombre: true, email: true, telefono: true } // Nunca devolvemos el password
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener perfil' });
  }
};
const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, telefono } = req.body;

    // Validación básica: no permitimos campos vacíos que rompan la base de datos
    if (!nombre) {
      return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: req.user.id }, // Usamos el ID del token
      data: { 
        nombre, 
        telefono 
      },
      select: { id: true, nombre: true, email: true, telefono: true }
    });

    res.json({ 
      mensaje: 'Perfil actualizado con éxito', 
      usuario: usuarioActualizado 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el perfil' });
  }
};

module.exports = { 
  registrarUsuario, 
  loginUsuario, 
  obtenerPerfil,
  actualizarPerfil
};