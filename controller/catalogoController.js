const axios = require('axios');
const FormData = require('form-data');


// catalogoController.js (Cliente)
exports.getCatalogo = async (req, res, next) => {
    try {
        console.log("Iniciando solicitud para obtener el catálogo...");

        // Verifica que el token esté presente
        if (!req.cookies.jwt) {
            throw new Error('Token no presente en las cookies');
        }

        const response = await fetch('http://localhost:4000/api/get-catalogo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.cookies.jwt}`
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud de catálogo: ${response.statusText}`);
        }

        const productos = await response.json();
        console.log("Productos obtenidos del API:", productos); // Imprime los productos para ver si los datos están correctos

        res.locals.productos = productos;

        console.log("Renderizando la vista con productos...");
        res.render('catalogo', { productos: res.locals.productos });
    } catch (error) {
        console.error('Error al obtener el catálogo:', error.message);
        next(error);
    }
};



exports.getAll = async (req, res, next) => {
    try {
        console.log('Iniciando solicitud a la API de catálogo...');
        const response = await fetch('http://localhost:4000/api/get-all');
        
        if (!response.ok) {
            console.log('Error en la respuesta de la API:', response.status, response.statusText);
            
            // Si el estado es 404, asumimos que no hay productos en la tabla
            if (response.status === 404) {
                console.log('El catálogo está vacío.');
                res.locals.catalogo = []; // Pasamos un array vacío si no hay productos
                return next(); // Continuamos sin lanzar un error
            }

            throw new Error('Error al obtener el catálogo: ' + response.statusText);
        }

        const catalogo = await response.json();

        // Asegúrate de que lo que se recibe es un array
        if (!Array.isArray(catalogo)) {
            throw new Error('El catálogo no tiene el formato esperado.');
        }

        res.locals.catalogo = catalogo;
        next(); // Continua con la siguiente función de middleware

    } catch (error) {
        console.error('Error al consumir el catálogo:', error.message);
        next(error); // Pasar el error al manejador de errores
    }
};





// uploadController.js


exports.addProduct = async (req, res) => {

    
    const { nombre_producto, descripcion, id_clase,link } = req.body;
    const imagen_producto = req.file; // Información del archivo subido

    if (!imagen_producto) {
        return res.status(400).json({ success: false, message: 'No se ha subido ninguna imagen' });
    }

    try {
        // Crear una instancia de FormData
        const form = new FormData();
        form.append('file', imagen_producto.buffer, { filename: imagen_producto.originalname });
        form.append('nombre_producto', nombre_producto);
        form.append('descripcion', descripcion);
        form.append('id_clase', id_clase);
        form.append('link', link);

        // Configurar los encabezados de la solicitud, incluyendo los encabezados generados por form-data
        const headers = form.getHeaders();

        // Enviar la imagen y los otros datos a un servidor externo
        const response = await axios.post('http://localhost:4000/api/add-producto', form, {
            headers: {
                ...headers,
                'Content-Type': 'multipart/form-data'
            }
        });

        // Procesar otros datos y responder al cliente
        res.redirect('/getAll');
    } catch (error) {
        console.error('Error al enviar la imagen y datos al servidor externo:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: 'Error al agregar el producto' });
    }
};


exports.eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const url = `${process.env.pathApi}/delete-producto/${id}`;

        const response = await fetch(url, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}, Response: ${await response.text()}`);
        }

        res.json({ message: 'Estudiante eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

}


exports.actualizarProducto = async (req, res) => {
    const { id_catalogo, nombre_producto, descripcion, id_clase, link } = req.body;
    const imagen_producto = req.file; // Información del archivo subido

    if (!id_catalogo) {
        return res.status(400).json({ success: false, message: 'ID del catálogo es requerido' });
    }

    try {
        // Crear una instancia de FormData
        const form = new FormData();
        if (imagen_producto) {
            form.append('file', imagen_producto.buffer, { filename: imagen_producto.originalname });
        }
        form.append('nombre_producto', nombre_producto);
        form.append('descripcion', descripcion);
        form.append('id_clase', id_clase);
        form.append('link', link);

        // Configurar los encabezados de la solicitud, incluyendo los encabezados generados por form-data
        const headers = form.getHeaders();

        // Enviar los datos y la imagen a un servidor externo
        const response = await axios.put(`http://localhost:4000/api/update-producto/${id_catalogo}`, form, {
            headers: {
                ...headers,
                'Content-Type': 'multipart/form-data'
            }
        });

        // Procesar la respuesta del servidor y redirigir al cliente
        res.redirect('/getAll');
    } catch (error) {
        console.error('Error al enviar la imagen y datos al servidor externo:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: 'Error al actualizar el producto' });
    }
};