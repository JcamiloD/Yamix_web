const { render } = require('ejs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');



exports.register = async (req, res) => {
    const { nombre, apellido, gmail, contraseña, fecha_nacimiento, id_clase } = req.body;
    try {

        if (!nombre || !apellido || !contraseña || !fecha_nacimiento || !id_clase) {
            return res.render('inscripcion', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese todos los campos",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'inscripcion'
            });
        }


        if (!gmail.includes('@')) {
            return res.render('inscripcion', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "El correo es inválido",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'inscripcion'
            });
        }

        if (!/^\d{6,}$/.test(contraseña)) {
            return res.render('inscripcion', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "La contraseña debe tener al menos 6 dígitos",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'inscripcion'
            });
        }


        const today = new Date();
        const birthDate = new Date(fecha_nacimiento);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }


        const userData = { nombre, apellido, gmail, contraseña, fecha_nacimiento, id_clase };

        const apiResponse = await fetch('http://localhost:4000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (apiResponse.ok) {

            if (age < 18) {
                return res.render('inscripcion', {
                    alert: true,
                    alertTitle: "Advertencia",
                    alertMessage: "Eres menor de edad. Tu cuenta estará en espera hasta que un administrador apruebe tu solicitud.",
                    alertIcon: 'info',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                });
            } else {
                return res.render('inscripcion', {
                    alert: true,
                    alertTitle: "Éxito",
                    alertMessage: "Registro exitoso",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 2500,
                    ruta: 'login'
                });
            }
        } else {
            return res.render('inscripcion', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "El usuario ya se encuentra registrado",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 2500,
                ruta: 'inscripcion'
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error });
    }
}

exports.login = async (req, res) => {
    const { gmail, pass } = req.body;

    try {
        if (!gmail || !pass) {
            return res.render('login', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Ingresa Datos en los campos",
                alertIcon: 'error',
                showConfirmButton: false,
                timer: 3500,
                ruta: 'login'
            });
        }

        const loginData = { gmail, pass };
        const apiResponse = await fetch('http://localhost:4000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const responseData = await apiResponse.json();

        if (apiResponse.ok) {
            const { token } = responseData;
            const cookieOptions = {
                expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
                httpOnly: true
            };
            res.cookie('jwt', token, cookieOptions);


            return res.render('login', {
                alert: true,
                alertTitle: "Conexión exitosa",
                alertMessage: "Login correcto",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            });
        } else {
            if (responseData.message === 'Tu cuenta está deshabilitada') {
                return res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Tu cuenta está deshabilitada, si tienes dudas del porque envíanos un correo con tu inquietud: yamix892@gmail.com",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                });
            }
            if (responseData.message === 'Tu cuenta está en espera') {
                return res.render('login', {
                    alert: true,
                    alertTitle: "Ups..",
                    alertMessage: "Tu cuenta está en espera de aprobación. Antes de unirte a nuestra academia, por favor completa los documentos necesarios.",
                    alertIcon: 'question',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login',
                    htmlContent: `
                        <a href="https://drive.google.com/drive/folders/1PGcNIgB4Cb6IGhBkJS7EhGVl2uy5snLS?usp=sharing" 
                           target="_blank" style="text-decoration:none;">
                            <button>Haz clic aquí para leer la guía</button>
                        </a>
                    `
                });
            }

            return res.render('login', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "La contraseña y/o el Gmail no coinciden",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 3500,
                ruta: 'login'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).render('login', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Error en el servidor",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: 2500,
            ruta: 'login'
        });
    }
};

exports.attachUserRole = async (req, res, next) => {
    try {
        if (req.cookies && req.cookies.jwt) {
            // Decodificar el token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

            // Llamar a la API para obtener el rol del usuario
            const apiResponse = await fetch('http://localhost:4000/api/get_role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${req.cookies.jwt}`
                },
                body: JSON.stringify({ id: decoded.id })
            });

            const userData = await apiResponse.json();
            if (userData && userData.rol) {
                req.usuario = { id: decoded.id, rol: userData.rol };

            } else {
                console.log('El rol del usuario no se encontró.');
            }
        }
        next();
    } catch (error) {
        console.log('Error en attachUserRole:', error);
        next();
    }
};


// Enviar código de recuperación desde el cliente
exports.enviarCodigo = async (req, res, next) => {
    const { email } = req.body;
    try {
        const response = await fetch('http://localhost:4000/api/enviar-codigo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (response.ok) {
            res.redirect('/codigo')
        } else {
            res.redirect('/recuperar')
        }
    } catch (error) {
        console.error('Error al enviar el código de recuperación:', error);
        res.status(500).json({ message: 'Error al enviar el código de recuperación.' });
    }
};


exports.verificarCodigo = async (req, res, next) => {
    try {
        const { codigo, nuevaContraseña } = req.body;

        const response = await fetch('http://localhost:4000/api/verificarCodigo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ codigo, nuevaContraseña })
        });

        // Verificar si el contenido es JSON
        const contentType = response.headers.get('content-type');
        let result = {};

        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            throw new Error('Respuesta no es JSON');
        }

        if (response.ok) {
            res.redirect('/login')
        } else {
            res.redirect('/codigo')
        }
    } catch (error) {
        console.error('Error en la verificación del código:', error);
        res.status(500).json({ message: 'Error en la verificación del código.' });
    }
};


exports.restrictTo = (roles) => {
    return (req, res, next) => {
        if (!req.usuario || !req.usuario.rol) {
            return res.redirect('/');
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.redirect('/');
        }

        next();
    };
};


exports.logout = (req, res) => {
    res.clearCookie('jwt');
    return res.redirect('/')
}
