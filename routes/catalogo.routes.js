const express = require('express');
const FormData = require('form-data');
const multer = require('multer');
const axios = require('axios');
const router = express.Router();
const catalogoController = require('../controller/catalogoController');
const { restrictToPermiso } = require('../controller/middleware/rediect');
const { attachUserPermissions } = require('../controller/middleware/permisosParaVistas');
const { verifyToken } = require('../controller/middleware/verificarToken');

const storage = multer.memoryStorage(); // Usar memoria en lugar de almacenamiento en disco
const upload = multer({ storage: storage });

//estudiante
router.get('/catalogouser',verifyToken,restrictToPermiso('catalogo estudiante'), catalogoController.getCatalogo);



//admin

router.get('/getAll',verifyToken, restrictToPermiso('catalogo admin'), attachUserPermissions,catalogoController.getAll, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    res.render('./dashboard/catalogoadmin', { catalogo: res.locals.catalogo, permisos: userPermissions  });
});



router.post('/add',verifyToken, restrictToPermiso('catalogo admin'), upload.single('imagen_producto'), catalogoController.addProduct);


router.post('/actualizarProducto', verifyToken, restrictToPermiso('catalogo admin'),upload.single('imagen_producto'), catalogoController.actualizarProducto);

// En tu archivo de rutas
router.delete('/eliminarProducto/:id',verifyToken, restrictToPermiso('catalogo admin'), catalogoController.eliminar);




module.exports = router;