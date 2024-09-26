const db = require('../../config/db'); // Asegúrate de requerir la configuración de tu base de datos

exports.restrictToPermiso = (...permisosRequeridos) => {
    return (req, res, next) => {
        const { rol } = req.usuario;

        if (!rol) {
            return res.status(403).json({ message: 'Rol no encontrado' });
        }

        // Consulta para obtener los permisos del rol desde la base de datos
        const query = `
            SELECT p.nombre_permiso
            FROM permisos p
            JOIN permisos_rol rp ON p.id_permiso = rp.id_permiso
            JOIN rol r ON rp.id_rol = r.id_rol
            WHERE r.nombre_rol = ?
        `;

        db.query(query, [rol], (err, results) => {
            if (err) {
                console.error('Error al obtener los permisos del rol:', err);
                return res.status(500).json({ message: 'Error en el servidor' });
            }

            // Extraer los permisos obtenidos de la base de datos
            const permisos = results.map(row => row.nombre_permiso);

            // Verificar si al menos uno de los permisos requeridos está en la lista de permisos
            const tienePermiso = permisosRequeridos.some(permiso => permisos.includes(permiso));

            if (!tienePermiso) {
                // Enviar un script para mostrar un alert en el navegador del usuario
                return res.status(403).send(`
                    <script>
                        window.alert("No tienes permiso para acceder a esta ruta.");
                        window.location.href = "/";
                    </script>
                `);
            }

            next();
        });
    };
};

// Uso del middleware
// restrictToPermiso('calendario estudiante', 'calendario profesor')
