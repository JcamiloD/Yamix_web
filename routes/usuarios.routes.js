const express = require('express');
const router = express.Router();

const { restrictToPermiso } = require('../controller/middleware/rediect');
const { attachUserPermissions } = require('../controller/middleware/permisosParaVistas');
const { verifyToken } = require('../controller/middleware/verificarToken');
const usuarios = require('../controller/usuarios_crud');

// Controlador traer estudiantes
router.get('/estudiantes', verifyToken, restrictToPermiso('usuarios admin'), attachUserPermissions, usuarios.traer, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('./dashboard/estudiantes', { data: res.locals.data, permisos: userPermissions  });
});





// Controlador traer maestros
router.get('/profesores', verifyToken, restrictToPermiso('usuarios admin'), attachUserPermissions, usuarios.traer, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('./dashboard/profesores', { data: res.locals.data, permisos: userPermissions  });
});

// Renderizado del calendario para profesores
router.get('/calendarioProfe',verifyToken, restrictToPermiso('usuarios admin'), (req, res) => {
    res.render('calendarioProfe', { alert: false });
});

// Controlador traer admin
router.get('/administradores',verifyToken, restrictToPermiso('usuarios admin'), attachUserPermissions, usuarios.traer, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('./dashboard/administradores', { data: res.locals.data,permisos: userPermissions  });
});
router.get('/usuariosEspera',verifyToken, restrictToPermiso('usuarios admin'), attachUserPermissions, usuarios.traerEspera, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('./dashboard/soloEspera', { data: res.locals.data, permisos: userPermissions  });
});



// Controladores usuarios
router.post('/agregar_usuario',verifyToken, restrictToPermiso('usuarios admin'), (req, res, next) => {
    next();
}, usuarios.agregarUsuario, (req, res) => {
    res.redirect('/usuarios');
});

router.get('/usuarios', verifyToken, restrictToPermiso('usuarios admin'), attachUserPermissions, usuarios.traer, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('./dashboard/usuarios', { data: res.locals.data, permisos: userPermissions  });
});


// Ruta para mostrar el formulario de edición
router.get('/editar_usuario/:id',verifyToken, restrictToPermiso('usuarios admin'), usuarios.obtenerUsuarioPorId, (req, res) => {
    res.render('./dashboard/editar_usuario', { usuario: res.locals.usuario });
});

router.post('/editar_usuario/:id', verifyToken, restrictToPermiso('usuarios admin'),
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



router.delete('/eliminar/:id', verifyToken, restrictToPermiso('usuarios admin'),usuarios.eliminarUsuario);

router.get('/inscripciones', verifyToken, restrictToPermiso('usuarios admin'), usuarios.traer, (req, res) => {
    res.render('./dashboard/inscripciones', { data: res.locals.data });
});



module.exports = router;
