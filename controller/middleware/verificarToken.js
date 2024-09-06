
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.cookies.jwt; // O de otro lugar donde almacenes el token

    if (!token) {
        return res.status(401).json({ message: 'No estás autenticado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ message: 'Token no válido' });
        }

        // Aquí es donde deberías asignar el token decodificado a `req.usuario`
        req.usuario = decodedToken;

        next();
    });
};
