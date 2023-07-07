from flask import Flask,jsonify,request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app=Flask(__name__) #Crea el objeto app de la clase Flask
CORS(app) # permite acceder desde el front al back

#configura la base de daos, con el nombre de usuario y la clave
#app.config['SQLALCHEMY_DATABASE_URI']='mysql+pymysql://user:password@localhost/proyecto'
app.config['SQLALCHEMY_DATABASE_URI']='mysql+pymysql://root:root@localhost:3307/proyecto'
#URI de la BBDD
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False #none
db= SQLAlchemy(app) #crea el objeto db de la clase SQLAlquemy
ma=Marshmallow(app) #crea el objeto ma de la clase Marshmallow

#-----------fin de configuracion--------------

#definimos la tabla lo que vamos a definir en nuestra base
class Producto(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    nombre_prod=db.Column(db.String(100))
    precio=db.Column(db.Integer)
    imagen=db.Column(db.String(400))
    usuario=db.Column(db.String(100))
    
    def __init__(self,nombre_prod,precio,imagen,usuario):
        self.nombre_prod = nombre_prod
        self.precio = precio
        self.imagen = imagen
        self.usuario = usuario
        
#si hay mas tablas para crear las definimos aca


with app.app_context():
    db.create_all() #crea las tablas
    
class ProductoSchema(ma.Schema):
    class Meta:
        fields=('id','nombre_prod', 'precio', 'imagen','usuario') 
        
producto_schema= ProductoSchema() #El objeto para traer un producto
productos_schema= ProductoSchema(many=True) #trae muchos registro de producto

#Creamos los Endponit

#GET
#POST
#Delete
#Put

#Get endponit del get
@app.route('/productos', methods=['GET'])
def get_Productos():
    all_productos = Producto.query.all() #heredamos del db.model
    result= productos_schema.dump(all_productos) # heredado de ma.schema
                                # trae todos los registro de la tabla y los retornamos en un JSON
    print (result)
    return jsonify(result)

@app.route('/productos/<id>',methods=['GET'])
def get_producto(id):
    producto=Producto.query.get(id)
    return producto_schema.jsonify(producto) #retorna el JSON de ina producto recibido como parametro

@app.route('/productos/<id>',methods=['DELETE'])
def delete_producto(id):
    producto=Producto.query.get(id)
    db.session.delete(producto)
    db.session.commit()
    return producto_schema.jsonify(producto) # devuelve un json con el registro eliminado

@app.route('/productos',methods=['POST']) #crea ruta o endpoint
def create_producto():
    #print(request.json)  #request.json contiene el json que envia el cliente
    nombre_prod=request.json['nombre_prod']
    precio=request.json['precio']
    imagen=request.json['imagen']
    usuario=request.json['usuario']
    new_producto=Producto(nombre_prod,precio,imagen,usuario)
    db.session.add(new_producto)
    db.session.commit()
    return producto_schema.jsonify(new_producto)
    
@app.route('/productos/<id>',methods=['PUT'])
def update_producto(id):
    producto=Producto.query.get(id)
    
    producto.nombre_prod=request.json['nombre_prod']
    producto.precio=request.json['precio']
    producto.imagen=request.json['imagen']
    producto.usuario=request.json['usuario']
    
    db.session.commit()
    return producto_schema.jsonify(producto)


#Programa principal
if __name__ == '__main__':
    app.run(debug=True, port=5000)