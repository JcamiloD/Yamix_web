
exports.restrictToPermiso = (permisoRequerido) => {
    return (req, res, next) => {
        const { permisos } = req.usuario;

        if (!permisos || !permisos.includes(permisoRequerido)) {
            // Enviar un script para mostrar un alert en el navegador del usuario
            return res.status(403).send(`
                <script>
                    window.alert("No tienes permiso para acceder a esta ruta.");
                    window.location.href = "/";
                </script>
            `);
        }

        next();
    };
};