const express = require('express');
const router = express.Router();
const auth = require('../controller/authController');
const usuarios = require('../controller/usuarios_crud');
const clases = require('../controller/clases_crud');
const roles = require('../controller/roles_controller');

router.use(auth.attachUserRole);

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

router.get('/codigo', (req, res) => {
    res.render('codigo');
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

router.get('/perfil', auth.restrictTo(['estudiante','admin']), (req, res) => {
    res.render('perfil', { usuario: req.usuario });
});


// Controladores login
router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/logout', auth.logout);
router.post('/enviar_codigo', auth.enviarCodigo)
router.post('/restablecer', auth.verificarCodigo)



// Controlador traer estudiantes
router.get('/estudiantes', auth.restrictTo(['admin']), usuarios.traer, (req, res) => {
    res.render('./dashboard/estudiantes', { data: res.locals.data });
});
// Controlador traer maestros
router.get('/profesores', auth.restrictTo(['admin']), usuarios.traer, (req, res) => {
    res.render('./dashboard/profesores', { data: res.locals.data });
});
// Controlador traer admin
router.get('/administradores', auth.restrictTo(['admin']), usuarios.traer, (req, res) => {
    res.render('./dashboard/administradores', { data: res.locals.data });
});

// Controladores usuarios
router.post('/agregar_usuario', (req, res, next) => {
    next();
}, usuarios.agregarUsuario, (req, res) => {
    res.redirect('/usuarios');
});

// Controlador traer roles
router.get('/permisos', auth.restrictTo(['admin']), roles.traer, (req, res) => {
    res.render('./dashboard/permisos', { data: res.locals.data });
});

// Ruta para obtener todos los permisos
router.get('/todos_permisos', auth.restrictTo(['admin']), roles.traerPermisos, (req, res) => {
    res.json(res.locals.data);
});

// Ruta para obtener permisos por rol
router.get('/permisos_rol/:rolId', auth.restrictTo(['admin']), roles.traerPermisosPorRol, (req, res) => {
    res.json(res.locals.data);
});


router.get('/usuarios', auth.restrictTo(['admin']), usuarios.traer, (req, res) => {
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
router.get('/mixtas', auth.restrictTo(['admin']), clases.traer, (req, res) => {
    res.render('./dashboard/mixtas', { data: res.locals.data });
});
// Controlador boxeo
router.get('/boxeo', auth.restrictTo(['admin']), clases.traer, (req, res) => {
    res.render('./dashboard/boxeo', { data: res.locals.data });
});
// Controlador parkour
router.get('/parkour', auth.restrictTo(['admin']), clases.traer, (req, res) => {
    res.render('./dashboard/parkour', { data: res.locals.data });
});

// Controlador clases
router.get('/clases', auth.restrictTo(['admin']), clases.traer, (req, res) => {
    res.render('./dashboard/clases', { data: res.locals.data });
});

// Dashboard rutas
router.get('/dashboard',auth.restrictTo(['admin']), (req, res) => {
    res.render('./dashboard/dashboard');
});

router.get('/inscripciones', auth.restrictTo(['admin']), usuarios.traer, (req, res) => {
    res.render('./dashboard/inscripciones', { data: res.locals.data });
});

module.exports = router;
