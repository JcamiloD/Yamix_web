const express = require('express');
const router = express.Router();
const { restrictToPermiso } = require('../controller/middleware/rediect');
const { attachUserPermissions } = require('../controller/middleware/permisosParaVistas');
const { verifyToken } = require('../controller/middleware/verificarToken');
const asistencias = require('../controller/asistenciasController');

const clases = require('../controller/clases_crud');

// Ruta para obtener asistencias y renderizar la vista
router.get('/asistencias', verifyToken, restrictToPermiso('roles'), asistencias.traer, asistencias.traerAsistenciaData, (req, res) => {
    res.render('./dashboard/asistencias', { 
        data: res.locals.data, 
        clases: res.locals.clases,
        usuarios: res.locals.usuarios 
    });
});





//camilo
router.post('/agregarAsistencia', asistencias.agregarAsistencia)

router.delete('/eliminarAsistencia/:id', asistencias.eliminarAsistencia)

router.post('/actualizarAsistencia', asistencias.actualizarAsistencia)


router.get('/soloboxeo', asistencias.mostrarAsistenciaBoxeo,asistencias.traerAsistenciaData, (req, res) => {
    res.render('./dashboard/soloboxeo', { 
        
    });
});

router.get('/soloMixtas', asistencias.mostrarAsistenciaMixtas,asistencias.traerAsistenciaData, (req, res) => {
    res.render('./dashboard/soloMixtas', { 
        data: res.locals.data, 
        clases: res.locals.clases,
        usuarios: res.locals.usuarios 
    });
});

router.get('/soloParkour', asistencias.mostrarAsistenciaParkour, asistencias.traerAsistenciaData, (req, res) => {
    res.render('./dashboard/soloParkour', { 
        data: res.locals.data, 
        clases: res.locals.clases,
        usuarios: res.locals.usuarios 
    });
});



//capa usuario

router.get('/asistenciasUser',clases.traer, (req, res) => {
    res.render('asistenciaUser',{
        clases: res.locals.data
    });
});



module.exports = router;
