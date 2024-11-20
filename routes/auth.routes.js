const express = require('express');
const router = express.Router();
const { restrictToPermiso } = require('../controller/middleware/rediect');
const { attachUserPermissions } = require('../controller/middleware/permisosParaVistas');
const { verifyToken } = require('../controller/middleware/verificarToken');
const asistencias = require('../controller/asistenciasController');

const auth = require('../controller/authController')

// Controladores login
router.post('/register', asistencias.traerAsistenciaData, auth.register);
router.post('/login', auth.login);
router.get('/logout', auth.logout);
router.post('/enviar_codigo', auth.enviarCodigo)
router.post('/restablecer', auth.verificarCodigo)


module.exports = router;
