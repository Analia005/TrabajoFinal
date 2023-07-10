const { createApp } = Vue
createApp({
    data() {
        return {
            productos: [],
            url: 'http://localhost:5000/productos',
            error: false,
            cargando: true,
            /*atributos para el guardar los valores del formulario */
            id: 0,
            nombre_prod: "",
            precio: 0,
            imagen: "",
            usuario: "",
            mensaje: "",
        }
    },
    methods: {
        controlarCampos() {
            this.mensaje = ''
            if (this.nombre_prod.trim() === '') {
                this.mensaje = 'Nombre del producto no puede ser vacio\n'
            }
            if (this.precio === 0) {
                this.mensaje = this.mensaje + 'Precio no puede ser vacio\n'
            }
            if (this.usuario.trim() === '') {
                this.mensaje = this.mensaje + 'Nombre de usuario no puede ser vacio'
            }
        },
        fetchData(url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    this.productos = data;
                    this.cargando = false
                })
                .catch(err => {
                    console.error(err);
                    this.error = true
                })
        },
        eliminar(productos) {
            let confirma = confirm("Estas seguro de eliminar el producto?");
            if (confirma == true) {
                const url = this.url + '/' + productos;
                var options = {
                    method: 'DELETE',
                }
                fetch(url, options)
                    .then(res => res.text()) // or res.json()
                    .then(res => {
                        location.reload();
                    })
            } else {
                return false
            };
        },
        grabar() {
            this.controlarCampos()
            console.log(this.mensaje)
            if (this.mensaje === '') {

                let productos = {
                    nombre_prod: this.nombre_prod,
                    precio: this.precio,
                    imagen: this.imagen,
                    usuario: this.usuario
                }
                var options = {
                    body: JSON.stringify(productos),
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    redirect: 'follow'
                }
                fetch(this.url, options)
                    .then(function () {
                        console.log(productos)
                        alert("Registro grabado")
                        window.location.href = "./productos.html";
                    })
                    .catch(err => {
                        console.error(err);
                        alert("Error al Grabar")
                    })
            }
            else {
                alert(this.mensaje)
            }
        }
    },
    created() {
        this.fetchData(this.url)
    },
}).mount('#app')