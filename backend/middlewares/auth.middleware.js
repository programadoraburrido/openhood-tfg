const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  // 1. Obtener el token de la cabecera Authorization
  // El formato suele ser: "Bearer [TOKEN]"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ mensaje: 'No se proporcionó un token de acceso.' });
  }

  try {
    // 2. Verificar si el token es válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta_openhood_2026');
    
    // 3. Guardar la info del usuario en la request para que el siguiente paso la use
    req.user = decoded;
    
    // 4. Saltar al siguiente paso (el controlador)
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
  }
};

module.exports = verificarToken;