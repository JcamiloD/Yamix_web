const express = require('express');
const router = express.Router();
const { restrictToPermiso } = require('../controller/middleware/rediect');
const { attachUserPermissions } = require('../controller/middleware/permisosParaVistas');
const { verifyToken } = require('../controller/middleware/verificarToken');
const asistencias = require('../controller/asistenciasController');



// Ruta para obtener asistencias y renderizar la vista
router.get('/asistencias', verifyToken, restrictToPermiso('asistencia admin'), attachUserPermissions,asistencias.traer,  asistencias.traerAsistenciaData, (req, res) => {
    console.log(res.locals.data);
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('./dashboard/asistencias', { 
        data: res.locals.data, 
        clases: res.locals.clases,
        usuarios: res.locals.usuarios, 
        permisos: userPermissions 
        
    });
});

router.post('/createAsistencia',verifyToken, restrictToPermiso('asistencia admin'), asistencias.crearAsistencia)




//camilo
router.post('/agregarAsistencia', verifyToken, restrictToPermiso('asistencia admin'),asistencias.agregarAsistencia)


router.delete('/eliminarAsistencia/:id',verifyToken, restrictToPermiso('asistencia admin'), asistencias.eliminarAsistencia)

router.post('/actualizarAsistencia',verifyToken, restrictToPermiso('asistencia admin'), asistencias.actualizarAsistencia)


router.get('/soloboxeo', verifyToken, restrictToPermiso('asistencia admin'),asistencias.mostrarAsistenciaBoxeo,  attachUserPermissions,asistencias.traerAsistenciaData, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('./dashboard/soloboxeo', { 
        data: res.locals.data, 
        clases: res.locals.clases,
        usuarios: res.locals.usuarios,
        permisos: userPermissions 
    });
});


router.get('/soloMixtas',verifyToken, restrictToPermiso('asistencia admin'), asistencias.mostrarAsistenciaMixtas, attachUserPermissions,asistencias.traerAsistenciaData, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('./dashboard/soloMixtas', { 
        data: res.locals.data, 
        clases: res.locals.clases,
        usuarios: res.locals.usuarios,
        permisos: userPermissions 
    });
});

router.get('/soloParkour',verifyToken, restrictToPermiso('asistencia admin'), asistencias.mostrarAsistenciaParkour, attachUserPermissions, asistencias.traerAsistenciaData, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('./dashboard/soloParkour', { 
        data: res.locals.data, 
        clases: res.locals.clases,
        usuarios: res.locals.usuarios,
        permisos: userPermissions 
    });
});



//capa usuario

router.get('/asistenciaProfe', verifyToken, restrictToPermiso('asistencia profesor','asistencia estudiante'),attachUserPermissions,asistencias.traer, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('asistenciaProfe',{
        clases: res.locals.data,
        permisos: userPermissions
    });
});



router.get('/agregarAsistenciaProfe',verifyToken, restrictToPermiso('asistencia profesor','asistencia admin'),attachUserPermissions,asistencias.traerAsistenciaData, (req, res) => {
    res.render('agregarAsistencia',{
        clases: res.locals.clases,
        usuarios: res.locals.usuarios
    }); 
});



//estudiante


router.get('/asistenciaUser',verifyToken, restrictToPermiso('asistencia estudiante'),attachUserPermissions,asistencias.obtenerAsistenciasPorUsuario, (req, res) => {
    console.log(res.locals.data)
    res.render('asistenciaUser',{
        data: res.locals.data
    });
});



module.exports = router;
