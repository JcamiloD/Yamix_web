const express = require('express');
const router = express.Router();

const { restrictToPermiso } = require('../controller/middleware/rediect');
const { attachUserPermissions } = require('../controller/middleware/permisosParaVistas');
const { verifyToken } = require('../controller/middleware/verificarToken');



const usuarios = require('../controller/usuarios_crud');



// Controlador traer estudiantes
router.get('/estudiantes', verifyToken, restrictToPermiso('estudiantes'),  usuarios.traer, (req, res) => {
    res.render('./dashboard/estudiantes', { data: res.locals.data });
});


router.get('/usuariosEspera', verifyToken, restrictToPermiso('estudiantes'),  usuarios.traerEspera, (req, res) => {
    res.render('./dashboard/soloEspera', { data: res.locals.data });
});




// Controlador traer maestros
router.get('/profesores', verifyToken, restrictToPermiso('profesores'),  usuarios.traer, (req, res) => {
    res.render('./dashboard/profesores', { data: res.locals.data });
});
// Controlador traer admin
router.get('/administradores', verifyToken, restrictToPermiso('administradores'),  usuarios.traer, (req, res) => {
    res.render('./dashboard/administradores', { data: res.locals.data });
});

// Controladores usuarios
router.post('/agregar_usuario', (req, res, next) => {
    next();
}, usuarios.agregarUsuario, (req, res) => {
    res.redirect('/usuarios');
});


router.get('/usuarios', verifyToken, restrictToPermiso('usuarios'),  usuarios.traer, (req, res) => {
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


router.get('/inscripciones', verifyToken, restrictToPermiso('inscripciones'),  usuarios.traer, (req, res) => {
    res.render('./dashboard/inscripciones', { data: res.locals.data });
});


module.exports = router;
