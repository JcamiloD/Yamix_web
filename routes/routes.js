const express = require('express');
const router = express.Router();

const { restrictToPermiso } = require('../controller/middleware/rediect');
const { attachUserPermissions } = require('../controller/middleware/permisosParaVistas');
const { verifyToken } = require('../controller/middleware/verificarToken');

router.use(attachUserPermissions);

router.get('/', (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    console.log(userPermissions)
    res.render('index', { permisos: userPermissions });
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
router.get('/calendario', (req, res) => {
    res.render('calendario', { alert: false });
});

router.get('/modalNuevoEvento', (req, res) => {
    res.render('modalNuevoEvento', { alert: false });
});


router.get('/modalUpdateEvento', (req, res) => {
    res.render('modalUpdateEvento', { alert: false });
});


router.get('/perfil', verifyToken, restrictToPermiso('perfil'), (req, res) => {
    res.render('perfil', { usuario: req.usuario });
});


// Dashboard rutas
router.get('/dashboard', verifyToken, restrictToPermiso('dashboard'), (req, res) => {
    res.render('./dashboard/dashboard');
});



module.exports = router;
