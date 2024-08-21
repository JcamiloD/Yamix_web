const express = require('express');
const router = express.Router();
const auth = require('../controller/authController');
const usuarios = require('../controller/usuarios_crud');
const clases = require('../controller/clases_crud');


router.get('/', auth.attachUserRole, (req, res) => {
    const userRole = req.usuario ? req.usuario.rol : null;
    res.render('index', { role: userRole });
});
router.get('/restablecer', (req, res) => {
    res.render('restablecer');
});
router.get('/recuperar', (req, res) => {
    res.render('recuperar');
});
router.get('/catalogo', (req, res) => {
    res.render('catalogo');
});
router.get('/cata', (req, res) => {
    res.render('cata');
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



// Controlador traer estudiantes
router.get('/estudiantes', auth.isAuth, usuarios.traer, (req, res) => {
    res.render('./dashboard/estudiantes', { data: res.locals.data });
});
// Controlador traer maestros
router.get('/profesores', auth.isAuth, usuarios.traer, (req, res) => {
    res.render('./dashboard/profesores', { data: res.locals.data });
});
// Controlador traer admin
router.get('/administradores', auth.isAuth, usuarios.traer, (req, res) => {
    res.render('./dashboard/administradores', { data: res.locals.data });
});

// Controladores usuarios
router.post('/agregar_usuario', (req, res, next) => {
    next();
}, usuarios.agregarUsuario, (req, res) => {
    res.redirect('/usuarios');
});

router.get('/usuarios', auth.isAuth, usuarios.traer, (req, res) => {
    res.render('./dashboard/usuarios', { data: res.locals.data });
});

router.get('/editar_usuario/:id', usuarios.obtenerUsuarioPorId, (req, res) => {
    res.render('./dashboard/editar_usuario', { usuario: res.locals.usuario });
});
router.put('/editar_usuario/:id', (req, res, next) => {
    next();
}, usuarios.editarUsuario, (req, res) => {
    res.redirect('/usuarios');
});

router.delete('/eliminar/:id', usuarios.eliminarUsuario);

// Controlador artes mixtas
router.get('/mixtas', auth.isAuth, clases.traer, (req, res) => {
    res.render('./dashboard/mixtas', { data: res.locals.data });
});
// Controlador boxeo
router.get('/boxeo', auth.isAuth, clases.traer, (req, res) => {
    res.render('./dashboard/boxeo', { data: res.locals.data });
});
// Controlador parkour
router.get('/parkour', auth.isAuth, clases.traer, (req, res) => {
    res.render('./dashboard/parkour', { data: res.locals.data });
});

// Controlador clases
router.get('/clases', auth.isAuth, clases.traer, (req, res) => {
    res.render('./dashboard/clases', { data: res.locals.data });
});

// Dashboard rutas
router.get('/dashboard', auth.isAuth, (req, res) => {
    res.render('./dashboard/dashboard');
});

router.get('/permisos', auth.isAuth, (req, res) => {
    res.render('./dashboard/permisos');
});

router.get('/inscripciones', auth.isAuth, usuarios.traer, (req, res) => {
    res.render('./dashboard/inscripciones', { data: res.locals.data });
});

module.exports = router;
