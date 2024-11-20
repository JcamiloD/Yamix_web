const { render } = require('ejs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const express = require('express');



exports.register = async (req, res) => {
    const { nombre, apellido, gmail, contraseña, fecha_nacimiento, id_clase } = req.body;
    try {
        // Validaciones de los campos
        if (!nombre || !apellido || !contraseña || !fecha_nacimiento || !id_clase) {
            return res.render('inscripcion', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese todos los campos",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'inscripcion',
                showGuideButton: false
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
                ruta: 'inscripcion',
                showGuideButton: false
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
                ruta: 'inscripcion',
                showGuideButton: false
            });
        }

        // Cálculo de la edad
        const today = new Date();
        const birthDate = new Date(fecha_nacimiento);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Registro del usuario a través de la API
        const userData = { nombre, apellido, gmail, contraseña, fecha_nacimiento, id_clase };
        const apiResponse = await fetch(`${process.env.pathApi}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (apiResponse.ok) {
            
            return res.render('inscripcion', {
                alert: true,
                alertTitle: age < 18 ? "Advertencia" : "Éxito",
                alertMessage: age < 18 
                    ? "Eres menor de edad. Tu cuenta estará en espera hasta que un administrador apruebe tu solicitud."
                    : "Registro exitoso",
                alertIcon: age < 18 ? 'info' : 'success',
                showConfirmButton: age < 18,
                timer: age < 18 ? false : 2500,
                ruta: 'login',
                showGuideButton: age < 18
            });
        } else {
            const errorData = await apiResponse.json();
            return res.render('inscripcion', {
                alert: true,
                alertTitle: "Error",
                alertMessage: errorData.message || "Error en el registro del usuario",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 2500,
                ruta: 'inscripcion',
                showGuideButton: false
            });
        }
    } catch (error) {
        return res.render('inscripcion', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Error del servidor",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: 2500,
            ruta: 'inscripcion',
            showGuideButton: false
        });
    }
};



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
                ruta: 'login',
                showGuideButton: false // No mostrar el botón
            });
        }

        const loginData = { gmail, pass };
        const apiResponse = await fetch(`${process.env.pathApi}/login`, {
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
                ruta: '',
                showGuideButton: false // No mostrar el botón
            });
        } else {
            let showGuideButton = false;
            if (responseData.message === 'Tu cuenta está deshabilitada' || responseData.message === 'Tu cuenta está en espera') {
                showGuideButton = true;
            }

            return res.render('login', {
                alert: true,
                alertTitle: responseData.message === 'Tu cuenta está en espera' ? "Ups.." : "Error",
                alertMessage: responseData.message,
                alertIcon: responseData.message === 'Tu cuenta está en espera' ? 'question' : 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'login',
                showGuideButton, // Pasar la variable a la vista
                htmlContent: `
                    <a href="https://drive.google.com/drive/folders/1PGcNIgB4Cb6IGhBkJS7EhGVl2uy5snLS?usp=sharing" 
                       target="_blank" style="text-decoration:none;">
                        <button>Haz clic aquí para leer la guía</button>
                    </a>
                `
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
            ruta: 'login',
            showGuideButton: false // No mostrar el botón
        });
    }
};


// exports.restrictTo = (roles) => {
//     return (req, res, next) => {
//         if (!req.usuario || !req.usuario.rol) {
//             return res.redirect('/');
//         }

//         if (!roles.includes(req.usuario.rol)) {
//             return res.redirect('/');
//         }

//         next();
//     };
// };
exports.enviarCodigo = async (req, res, next) => {
    const { email } = req.body;
    try {
        const response = await fetch(`${process.env.pathApi}/enviar-codigo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (response.ok) {
            res.render('codigo', { alert: { type: 'success', message: 'Código enviado correctamente.' } });
        } else {
            res.render('recuperar', { alert: { type: 'error', message: 'Error al enviar el código. Por favor, inténtalo de nuevo.' } });
        }
    } catch (error) {
        console.error('Error al enviar el código de recuperación:', error);
        res.render('recuperar', { alert: { type: 'error', message: 'Error al enviar el código de recuperación. Inténtalo más tarde.' } });
    }
};



exports.verificarCodigo = async (req, res, next) => {
    try {
        const { codigo, nuevaContraseña } = req.body;

        const response = await fetch(`${process.env.pathApi}/verificarCodigo`, {
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
            res.render('codigo', { alert: { type: 'error', message: 'Código incorrecto.' } });
        }
    } catch (error) {
        console.error('Error en la verificación del código:', error);
        res.status(500).json({ message: 'Error en la verificación del código.' });
    }
};





exports.logout = (req, res) => {
    res.clearCookie('jwt');
    return res.redirect('/')
}
