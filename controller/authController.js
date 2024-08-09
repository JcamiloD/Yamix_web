const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const { promisify } = require('util')
const { error } = require('console')




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
        } if (!gmail.includes('@')) {
            return res.render('inscripcion', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "El correo es inválido",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'inscripcion'
            });
        } else {
            const userData = { nombre, apellido, gmail, contraseña, fecha_nacimiento, id_clase };

            const apiResponse = await fetch('http://localhost:4000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (apiResponse.ok) {

                return res.render('inscripcion', {
                    alert: true,
                    alertTitle: "Éxito",
                    alertMessage: "Registro exitoso",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 2500,
                    ruta: 'login'
                });
            } else {
                return res.render('inscripcion', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "el usuario ya se encuentra registrado",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 2500,
                    ruta: 'inscripcion'
                });
            }
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
        const apiResponse = await fetch('http://localhost:4000/login', {
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
                expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
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
            // Manejar el estado del usuario
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
                    alertMessage: "Tu cuenta está en espera de aprobación. Antes de unirte a nuestra academia, por favor completa los documentos necesarios. Abre este enlace en tu navegador y lee la guía: https://drive.google.com/drive/folders/1PGcNIgB4Cb6IGhBkJS7EhGVl2uy5snLS?usp=sharing",
                    alertIcon: 'question',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
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
            const apiResponse = await fetch('http://localhost:4000/get-user-role', {
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
            }
        }
        next(); 
    } catch (error) {
        console.log('Error en attachUserRole:', error);
        next(); 
    }
};




exports.isAuth = async (req, res, next) => {
    try {
        if (req.cookies && req.cookies.jwt) {
            // Decodificar el JWT
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

            const apiResponse = await fetch('http://localhost:4000/verify-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${req.cookies.jwt}` 
                },
                body: JSON.stringify({ id: decodificada.id })
            });

            if (apiResponse.ok) {
                const userData = await apiResponse.json();

                if (!userData || !userData.usuario) {
                    return res.redirect('/'); 
                }

                req.usuario = userData.usuario;
                return next();
            } else {
                return res.redirect('/'); 
            }
        } else {
            return res.redirect('/'); 
        }
    } catch (error) {
        console.log('Error en la autenticación:', error);
        return res.redirect('/'); 
    }
};

exports.logout = (req, res) => {
    res.clearCookie('jwt');
    return res.redirect('/')
}