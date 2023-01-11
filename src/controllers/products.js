const mongoose=require("mongoose")
const {
    loggerDev,
    loggerProd
  } = require("../loggers/logger_config");
  
  const NODE_ENV = process.env.NODE_ENV || "development";
  const logger = NODE_ENV === "production"
  ? loggerProd
  : loggerDev


module.exports=class ProdMongoController {
    constructor(collection, schema) {
        this.collection = mongoose.model(collection, schema);
    }

    save = async (element) => {
        try {
            element.timestamp = new Date().toISOString();
            const newElement = new this.collection(element);
            const result = await newElement.save();
            return result;
        } catch (error) {
            logger.log("error","error al grabar productos")
            throw new Error(error);
        }
    }

    getAll = async () => {
        try {
            return await this.collection.find();
        } catch (error) {
            logger.log("error","error al mostrar productos")
            throw new Error(error);
        }
    }

    async getById(id) {
        try {
            const products= this.collection.findById({ _id: id });
            if (products)
            {
            return await products
            }
            else{
                throw new Error(error);
            }
        } catch (error) {
            logger.log("error","error al buscar un producto")
          
        }
    }

    async getByCategory(category) {
        try {
            const products=this.collection.find({ categoria: category });
            if (products)
            {
                return await products
            }
            else{
                throw new Error(error);s
            }
            
        } catch (error) {
            logger.log("error","error al buscar un producto")
            
        }
    }

    async updateById(id, element) {
        try {
            return await this.collection.findByIdAndUpdate({ _id: id }, element);
        } catch (error) {
            logger.log("error","error al actualizar productos")
            throw new Error(error);
        }
    }

    async deleteById(id) {
        try {
            return await this.collection.findByIdAndDelete({ _id: id });
        } catch (error) {
            logger.log("error","error al borrar un producto")
            throw new Error(error);
        }
    }

    async deleteAll() {
        try {
            return await this.collection.deleteMany({});
        } catch (error) {
            logger.log("error","error al borrar todos los productos")
            throw new Error(error);
        }
    }
}
