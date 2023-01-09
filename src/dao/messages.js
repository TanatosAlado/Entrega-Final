const messagesMongoController=require('../../controllers/mongo/messagesMongo.js')

class messagesDaoMongo extends messagesMongoController{
    constructor(){
        super ('mensajes',{
                mail: { type: String, required: true, max: 100 },
                nombre: { type: String, required: true, max: 100 },
                apellido: { type: String, required: true, max: 50 },
                edad: { type: Number, required: true },
                alias: { type: String, required: true },
                avatar: { type: String, required: true, max: 100 },
                timestamp: { type: Date, default: Date.now },
                text: { type: String, required: true, max: 400 },
                pregunta: { type: String, required: true, max: 400 },
                respuesta: { type: String, required: true, max: 400 }
            
        })
    }
}

module.exports= messagesDaoMongo