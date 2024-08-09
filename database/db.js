const mysql = require('mysql')

const conexion = mysql.createConnection({
    host : process.env.host,
    user : process.env.user,
    password : process.env.password,
    database : process.env.database
})


conexion.connect((error) =>{
    if (error) {
        console.log("El error de la conexión es: "+error)
        return
    }
    console.log("Conexíon exiotosa")
})

module.exports = conexion