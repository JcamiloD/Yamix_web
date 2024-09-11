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


router.get('/catalogouser', verifyToken, catalogoController.getCatalogo);


router.get('/getAll', catalogoController.getAll, (req, res) => {
    res.render('./dashboard/catalogoadmin', { catalogo: res.locals.catalogo });
});



router.post('/add', upload.single('imagen_producto'), catalogoController.addProduct);


router.post('/actualizarProducto', upload.single('imagen_producto'), catalogoController.actualizarProducto);

// En tu archivo de rutas
router.delete('/eliminarProducto/:id', catalogoController.eliminar);




module.exports = router;