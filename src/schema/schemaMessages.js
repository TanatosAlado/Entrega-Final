const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
        mail: { type: String, required: true, max: 100 },
        nombre: { type: String, required: true, max: 100 },
        apellido: { type: String, required: true, max: 50 },
        edad: { type: Number, required: true },
        alias: { type: String, required: true },
        avatar: { type: String, required: true, max: 100 },
        timestamp: { type: Date, default: Date.now },
        pregunta: { type: String, required: true, max: 400 },
        respuesta: { type: String, required: true, max: 400 }
});

const message = mongoose.model('Mensajes', messagesSchema);

module.exports=message;