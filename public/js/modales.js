// Modal agregar
const btnAbrirModalAgregar = document.querySelector("#btn-abrir-modal-agregar");
const btnCerrarModalAgregar = document.querySelector('#btn-cerrar-modal-agregar');
const modalAgregar = document.querySelector("#modal-agregar");

btnAbrirModalAgregar.addEventListener("click", () => {
    modalAgregar.showModal();
});

btnCerrarModalAgregar.addEventListener("click", () => {
    modalAgregar.close();
});

// Modal editar
const btnAbrirModalesEditar = document.querySelectorAll(".btn-abrir-modal-editar");
const btnCerrarModalEditar = document.querySelector('#btn-cerrar-modal-editar');
const modalEditar = document.querySelector("#modal-editar");

btnAbrirModalesEditar.forEach(btn => {
    btn.addEventListener("click", () => {
        modalEditar.showModal();
    });
});

function cerrarModalEditar() {
    document.getElementById('modal-editar').close();
}

// Modal eliminar
const btnAbrirModalesEliminar = document.querySelectorAll(".btn-abrir-modal-eliminar");
const btnCerrarModalEliminar = document.querySelector('#btn-cerrar-modal-eliminar');
const modalEliminar = document.querySelector("#modal-eliminar");

btnAbrirModalesEliminar.forEach(btn => {
    btn.addEventListener("click", () => {
        modalEliminar.showModal();
    });
});

function cerrarModalEliminar() {
    document.getElementById("modal-eliminar").close()
}
let btnAgregar = document.getElementById('btnAgregar');
btnAgregar.addEventListener('click', function agregar() {

    let nombre = document.getElementById('nombre').value;
    let imagen = document.getElementById('imagen').value;
    let categoria = document.getElementById('categoria').value;
    let precio = document.getElementById('precio').value;


    if (!nombre || !imagen || !categoria || !precio) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    if (!/\.(jpg|png)$/.test(imagen.toLowerCase())) {
        alert("Formato de imagen no válido. Utilice jpg o png.");
        return;
    }

    if (/\d/.test(nombre)) {
        alert("El campo de nombres no debe contener números.");
        return;
    }

    if (isNaN(parseFloat(precio))) {
        alert("El campo de precio debe ser numérico.");
        return;
    }


    let listaProductos = JSON.parse(localStorage.getItem('productos')) || [];
    let id = listaProductos.length !== 0 ? listaProductos[listaProductos.length - 1].id : 0;

    let nuevoProducto = {
        id: id + 1,
        nombre: nombre,
        imagen: imagen,
        categoria: categoria,
        precio: precio
    };

    listaProductos.push(nuevoProducto);
    localStorage.setItem('productos', JSON.stringify(listaProductos));

    setTimeout(() => {
        window.location.href = "cata";
    }, 1);
});

function editarP(id) {
    let listaProductos = JSON.parse(localStorage.getItem('productos')) || [];
    
    if (listaProductos.length === 0) {
        alert("No hay productos para editar.");
        return;
    }

    let producto = listaProductos.find(p => p.id == id);

    if (!producto) {
        alert("Producto no encontrado.");
        return;
    }


    let nombreEditar = document.getElementById('nombre_editar').value;
    let imagenEditar = document.getElementById('imagen_editar').value;
    let categoriaEditar = document.getElementById('categoria_editar').value;
    let precioEditar = document.getElementById('precio_editar').value;

  
    if (!nombreEditar || !imagenEditar || !categoriaEditar || !precioEditar) {
        alert("Por favor, complete todos los campos.");
        return;
    }

   
    if (!/\.(jpg|png)$/.test(imagenEditar.toLowerCase())) {
        alert("Formato de imagen no válido. Utilice jpg o png.");
        return;
    }

    if (/\d/.test(nombreEditar)) {
        alert("El campo de nombres no debe contener números.");
        return;
    }

   
    if (isNaN(parseFloat(precioEditar))) {
        alert("El campo de precio debe ser numérico.");
        return;
    }

    producto.nombre = nombreEditar;
    producto.imagen = imagenEditar;
    producto.categoria = categoriaEditar;
    producto.precio = precioEditar;

    localStorage.setItem('productos', JSON.stringify(listaProductos));

    alert("Producto editado correctamente.");
    setTimeout(() => {
        window.location.href = "cata";
    }, 1);
}

function eliminar(id_p) {
    let listaProductos = JSON.parse(localStorage.getItem('productos')) ?? [];
    listaProductos = listaProductos.filter(function (producto) {
        return producto.id != id_p;
    });
    localStorage.setItem('productos', JSON.stringify(listaProductos));
    setTimeout(() => {
        window.location.href = "cata";
    }, 1);
}
