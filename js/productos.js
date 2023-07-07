const { createApp } = Vue
  createApp({
    data() {
      return {
        productos:[],
        url:'http://localhost:5000/productos', 
        error:false,
        cargando:true,
        /*atributos para el guardar los valores del formulario */
        id:0,
        nombre_prod:"", 
        precio:0,
        imagen:"",
        usuario:"",
    }  
    },
    methods: {
        fetchData(url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    this.productos = data;
                    this.cargando=false
                })
                .catch(err => {
                    console.error(err);
                    this.error=true              
                })
        },
        eliminar(productos) {
            let confirma = confirm("Estas seguro de eliminar el producto?");
            if (confirma == true) {
                const url = this.url+'/' + productos;
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
        grabar(){
            let productos = {
                nombre_prod:this.nombre_prod,
                precio: this.precio,
                imagen: this.imagen,
                usuario:this.usuario
            }
            var options = {
                body:JSON.stringify(productos),
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow'
            }
            fetch(this.url, options)
                .then(function () {
                    alert("Registro grabado")
                    window.location.href = "./productos.html";
                })
                .catch(err => {
                    console.error(err);
                    alert("Error al Grabar")
                })
        },
    },
    created() {
        this.fetchData(this.url)
    },
  }).mount('#app')