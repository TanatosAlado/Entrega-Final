const mongoose=require("mongoose");
const {
    loggerDev,
    loggerProd
  } = require("../loggers/logger_config");
  const NODE_ENV = process.env.NODE_ENV || "development";
  const logger = NODE_ENV === "production"
  ? loggerProd
  : loggerDev
module.exports=class messagesMongoController {
    constructor(collection,schema) {
        this.collection = mongoose.model(collection, schema);
    }

   //TRAE TODOS LOS MENSAJES
    
    getAllMessages = async () => {
        try {
            return await this.collection.find();
        }  catch(err) {
            logger.log("error",err)
        }
    }

  // TRAER MENSJAE POR ID

    async getByMailMessages(mail) {
        try {
            return await this.collection.find({mail:mail});
        } catch (error) {
            logger.log("error","error al buscar un mail")
            throw new Error(error);
        }
    }

    // ACTUALIZAR MENSAJE POR ID

    async updateById(mail, element) {
        try {
            return await this.collection.updateOne({ mail: mail }, element);
        } catch (error) {
            logger.log("error","error al actualizar el mensaje")
            throw new Error(error);
        }
    }
}