console.log(location.search)     // lee los argumentos pasados a este formulario
var id=location.search.substr(4)
console.log(id)
const { createApp } = Vue
  createApp({
    data() {
      return {
        id:0,
        nombre_prod:"", 
        precio:0,
        imagen:"",
        usuario:"",
        url:'http://localhost:5000/productos/'+id,
       }  
    },
    methods: {
        fetchData(url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    this.id=data.id,
                    this.nombre_prod=data.nombre_prod,
                    this.precio=data.precio,
                    this.imagen=data.imagen,
                    this.usuario=data.usuario                  
                })
                .catch(err => {
                    console.error(err);
                    this.error=true              
                })
        },
        modificar() {
            let producto = {
                nombre_prod: this.nombre_prod,
                precio: this.precio,
                imagen: this.imagen,
                usuario: this.usuario
            }
            var options = {
                body: JSON.stringify(producto),
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow'
            }
            fetch(this.url, options)
                .then(function () {
                    alert("Registro modificado")
                    window.location.href = "./productos.html";
                })
                .catch(err => {
                    console.error(err);
                    alert("Error al Modificar")
                })          
        }
    },
    created() {
        this.fetchData(this.url)
    },
  }).mount('#app')