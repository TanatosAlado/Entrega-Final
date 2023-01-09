let instance = null
let misProductos = null

class SingletonClass {

    constructor(){
        this.value = Math.random(100)
    }

    crearProductos(obj){
        misProductos = obj;
    }

    getProductos(){
        return misProductos;
    }

    static getInstance() {
        if (!instance) {
            instance = new SingletonClass()
        }

        return instance
    }
}

module.exports = SingletonClass