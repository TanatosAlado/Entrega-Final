let instance = null
let misCarritos = null

class SingletonClass {

    constructor(){
        this.value = Math.random(100)
    }

    crearCarritos(obj){
        misCarritos = obj;
    }

    getCarritos(){
        return misCarritos;
    }

    static getInstance() {
        if (!instance) {
            instance = new SingletonClass()
        }

        return instance
    }
}

module.exports = SingletonClass