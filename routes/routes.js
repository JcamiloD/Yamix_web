const express = require('express');
const router = express.Router();
const auth = require('../controller/authController');
const usuarios = require('../controller/usuarios_crud');

router.get('/', auth.attachUserRole, (req, res) => {
    const userRole = req.usuario ? req.usuario.rol : null;
    res.render('index', { role: userRole });
    
});

//login
router.get('/inscripcion', (req, res) => {
    res.render('inscripcion');
});

router.get('/login', (req, res) => {
    res.render('login', { alert: false });
});

router.get('/perfil', auth.isAuth, (req, res) => {
    res.render('perfil', { usuario: req.usuario });
});


// Controladores login
router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/logout', auth.logout);




//controladores estudiantes
router.post('/agregar_usuario', (req, res, next) => {
    next();
}, usuarios.agregarUsuario, (req, res) => {
    res.redirect('/usuarios');
});

router.get('/usuarios', auth.isAuth, usuarios.traer, (req, res) => {
    res.render('./dashboard/usuarios', { data: res.locals.data });
});

router.delete('/eliminar/:id', usuarios.eliminarUsuario);




//dashboard rutas
router.get('/dashboard',auth.isAuth, (req, res) => {
    res.render('./dashboard/dashboard');
});


router.get('/permisos',auth.isAuth, (req, res) => {
    res.render('./dashboard/permisos');
});





module.exports = router;
