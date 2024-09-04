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

router.get('/perfil', auth.verifyToken, auth.restrictToPermiso('perfil'), (req, res) => {
    res.render('perfil', { usuario: req.usuario });
});


// Controladores login
router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/logout', auth.logout);
router.post('/enviar_codigo', auth.enviarCodigo)
router.post('/restablecer', auth.verificarCodigo)



// Controlador traer estudiantes
router.get('/estudiantes', auth.verifyToken, auth.restrictToPermiso('estudiantes'),  usuarios.traer, (req, res) => {
    res.render('./dashboard/estudiantes', { data: res.locals.data });
});
// Controlador traer maestros
router.get('/profesores', auth.verifyToken, auth.restrictToPermiso('profesores'),  usuarios.traer, (req, res) => {
    res.render('./dashboard/profesores', { data: res.locals.data });
});
// Controlador traer admin
router.get('/administradores', auth.verifyToken, auth.restrictToPermiso('administradores'),  usuarios.traer, (req, res) => {
    res.render('./dashboard/administradores', { data: res.locals.data });
});

// Controladores usuarios
router.post('/agregar_usuario', (req, res, next) => {
    next();
}, usuarios.agregarUsuario, (req, res) => {
    res.redirect('/usuarios');
});

// Controlador traer roles
router.get('/permisos', auth.verifyToken, auth.restrictToPermiso('roles'),  roles.traer, (req, res) => {
    res.render('./dashboard/permisos', { data: res.locals.data });
});

// Ruta para obtener todos los permisos
router.get('/todos_permisos',  roles.traerPermisos, (req, res) => {
    res.json(res.locals.data);
});

// Ruta para obtener permisos por rol
router.get('/permisos_rol/:rolId',  roles.traerPermisosPorRol, (req, res) => {
    res.json(res.locals.data);
});

// Ruta para actualizar permisos de un rol
router.post('/actualizar_permisos', roles.actualizarPermisosPorRol);

router.get('/usuarios', auth.verifyToken, auth.restrictToPermiso('usuarios'),  usuarios.traer, (req, res) => {
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
router.get('/mixtas', auth.verifyToken, auth.restrictToPermiso('mixtas'),  clases.traer, (req, res) => {
    res.render('./dashboard/mixtas', { data: res.locals.data });
});
// Controlador boxeo
router.get('/boxeo', auth.verifyToken, auth.restrictToPermiso('boxeo'),  clases.traer, (req, res) => {
    res.render('./dashboard/boxeo', { data: res.locals.data });
});
// Controlador parkour
router.get('/parkour', auth.verifyToken, auth.restrictToPermiso('parkour'),  clases.traer, (req, res) => {
    res.render('./dashboard/parkour', { data: res.locals.data });
});

// Controlador clases
router.get('/clases', auth.verifyToken, auth.restrictToPermiso('clases'),  clases.traer, (req, res) => {
    res.render('./dashboard/clases', { data: res.locals.data });
});

// Dashboard rutas
router.get('/dashboard', auth.verifyToken, auth.restrictToPermiso('dashboard'), (req, res) => {
    res.render('./dashboard/dashboard');
});

router.get('/inscripciones', auth.verifyToken, auth.restrictToPermiso('inscripciones'),  usuarios.traer, (req, res) => {
    res.render('./dashboard/inscripciones', { data: res.locals.data });
});

module.exports = router;
