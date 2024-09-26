const express = require('express');
const router = express.Router();
const { restrictToPermiso } = require('../controller/middleware/rediect');
const { attachUserPermissions } = require('../controller/middleware/permisosParaVistas');
const { verifyToken } = require('../controller/middleware/verificarToken');

const perfil = require('../controller/perfilController');

router.get('/perfil', verifyToken,restrictToPermiso('perfil'), perfil.obtenerPerfil);
router.post('/perfil/actualizar', verifyToken, restrictToPermiso('perfil'), perfil.actualizarPerfil);


module.exports = router;
