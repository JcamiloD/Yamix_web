const express = require('express');
const router = express.Router();

const { restrictToPermiso } = require('../controller/middleware/rediect');
const { attachUserPermissions } = require('../controller/middleware/permisosParaVistas');
const { verifyToken } = require('../controller/middleware/verificarToken');
const usuarios = require('../controller/usuarios_crud');

// Controlador traer estudiantes
router.get('/estudiantes', verifyToken, restrictToPermiso('estudiantes'), usuarios.traer, (req, res) => {
    res.render('./dashboard/estudiantes', { data: res.locals.data });
});


// Integrar middleware para verificar permisos y renderizar calendario
router.get('/calendarioUser', verifyToken, attachUserPermissions, (req, res) => {
    // Comprobar el rol o permisos del usuario cargados en req.usuario
    const { rol } = req.usuario;

    if (rol === 'profesor') {
        res.render('calendarioProfe', { alert: false });
    } else {
        res.render('calendarioUser', { alert: false });
    }
});



// Controlador traer maestros
router.get('/profesores', verifyToken, restrictToPermiso('profesores'), usuarios.traer, (req, res) => {
    res.render('./dashboard/profesores', { data: res.locals.data });
});

// Renderizado del calendario para profesores
router.get('/calendarioProfe', (req, res) => {
    res.render('calendarioProfe', { alert: false });
});

// Controlador traer admin
router.get('/administradores', verifyToken, restrictToPermiso('administradores'), usuarios.traer, (req, res) => {
    res.render('./dashboard/administradores', { data: res.locals.data });
});
router.get('/usuariosEspera', verifyToken, restrictToPermiso('administradores'), usuarios.traerEspera, (req, res) => {
    res.render('./dashboard/soloEspera', { data: res.locals.data });
});



// Controladores usuarios
router.put('/agregar_usuario', (req, res, next) => {
    next();
}, usuarios.agregarUsuario, (req, res) => {
    res.redirect('/usuarios');
});

router.get('/usuarios', verifyToken, restrictToPermiso('usuarios'), usuarios.traer, (req, res) => {
    res.render('./dashboard/usuarios', { data: res.locals.data });
});


// Ruta para mostrar el formulario de edición
router.get('/editar_usuario/:id', usuarios.obtenerUsuarioPorId, (req, res) => {
    res.render('./dashboard/editar_usuario', { usuario: res.locals.usuario });
});

router.post('/editar_usuario/:id', 
    (req, res, next) => {
        console.log('Solicitud POST recibida para editar usuario');
        console.log('ID del usuario:', req.params.id); // Log del ID del usuario
        console.log('Body de la solicitud:', req.body); // Log del cuerpo de la solicitud
        next();
    }, 
    usuarios.editarUsuario, 
    (req, res) => {
        console.log('Usuario editado, redirigiendo a la lista de usuarios');
        res.redirect('/usuarios'); // Redirige a la lista de usuarios después de editar
    }
);



router.delete('/eliminar/:id', usuarios.eliminarUsuario);

router.get('/inscripciones', verifyToken, restrictToPermiso('inscripciones'), usuarios.traer, (req, res) => {
    res.render('./dashboard/inscripciones', { data: res.locals.data });
});



module.exports = router;
