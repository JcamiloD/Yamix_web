
const jwt = require('jsonwebtoken');


exports.verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;


    if (!token) {
        return res.status(401).json({ message: 'No estás autenticado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            console.error('Error de verificación del token:', err);
            return res.status(401).json({ message: 'Token no válido' });
        }

        req.usuario = decodedToken;
        next();
    });
};
