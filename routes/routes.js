const express = require('express');
const router = express.Router();
const auth = require('../controller/authController');

// Aplica el middleware para adjuntar el rol del usuario
router.get('/', auth.attachUserRole, (req, res) => {
    const userRole = req.usuario ? req.usuario.rol : null;// Verifica que el rol se esté obteniendo correctamente
    res.render('index', { role: userRole });
    
});

router.get('/inscripcion', (req, res) => {
    res.render('inscripcion');
});

router.get('/login', (req, res) => {
    res.render('login', { alert: false });
});

router.get('/perfil', auth.isAuth, (req, res) => {
    res.render('perfil', { usuario: req.usuario });
});


// Controladores
router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/logout', auth.logout);

module.exports = router;
