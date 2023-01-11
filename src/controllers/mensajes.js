// const config =require("../config/dbConfig.js")
// const mongoose =require("mongoose");
// const {normalizeMsj}=require("./normalizr.js")
// const twilio=require('twilio')
// const nodemailer= require('nodemailer');
// const { db } = require("../schema/schemaCarts.js");
// const {
//   loggerDev,
//   loggerProd
// } = require("../../logger_config");
// const NODE_ENV = process.env.NODE_ENV || "development";
// const logger = NODE_ENV === "production"
// ? loggerProd
// : loggerDev




// try {
//     mongoose.connect(config.mongoDb.url, config.mongoDb.options)
// } catch (error) {
//     console.log(error);
// };

// const mongooseSchema = new mongoose.Schema({
//     author: {
//         id: { type: String, required: true, max: 100 },
//         nombre: { type: String, required: true, max: 100 },
//         apellido: { type: String, required: true, max: 50 },
//         edad: { type: Number, required: true },
//         alias: { type: String, required: true },
//         avatar: { type: String, required: true, max: 100 },
//         timestamp: { type: Date, default: Date.now }
//     },
//     text: { type: String, required: true, max: 400 }
// });

// const msjModel = mongoose.model('mensajes', mongooseSchema);



// const saveMsjs = async (msj) => {
//     const newMsj = new msjModel(msj);
//     try {
//         newMsj.save()
//     } catch (error) {
//         throw new Error(error);
//     }
// }

// const getMsjs = async () => {
//     try {
//         const mensajes = await msjModel.find();
//         return normalizeMsj(mensajes);
//     } catch (error) {
//         logger.log("error",err)
//     }
// }


// //MENSAJES SMS CON TWILIO

// const accountSid = 'ACb1200a8e555e9b41c8ec2323345c9a71'; 
// const authToken = '9108c04775caa79108d16402618d5d1b'; 
// const client = twilio(accountSid, authToken); 

// async function sendSms() {
//     const smsOption={
//         from:"+18158804635",   
//         to: "+5493425289170",
//         body:"Recibimos tu pedidos, lo prepararemos a la brevedad"
//     }
//     try {
//         const info = await client.messages.create(smsOption);
//         console.log(info);
//     }  catch(err) {
//         logger.log("error",err)
//     }
// }

// async function sendWhatsapp(name,mail) {
//     const whatsAppOption={
//         from:"whatsapp:+14155238886",
//         to: "whatsapp:+5493425289170",
//         body:`Ingreso pedido de Nombre: ${name} Mail: ${mail}`
//     }    
//     try {
//       const info = await client.messages.create(whatsAppOption);
//       console.log(info);
//     }  catch(err) {
//       logger.log("error",err)
//     }
//   }

//   async function sendMail(name,mail,listCart) {
//     try {
//         await transporter.sendMail({
//           to:"topesox325@lance7.com",
//           from:"jovanny.goldner@ethereal.email",
//           subject:`nuevo pedido de Nombre: ${name} Mail: ${mail}`,
//           html:`${listCart}`
//       });
//       }  catch(err) {
//         logger.log("error",err)
//       }
//     }

//     async function deleteCartBuy(idCart){
//       try{
//        await db.collection("carts").deleteOne({id:idCart});
//       }
//       catch(err) {
//         logger.log("error",err)
//       }
//     }
//     const transporter = nodemailer.createTransport({
//         service:"gmail",
//         host: 'smtp.gmail.email',
//         port: 587,
//         auth: {
//             user: 'cybernanox@gmail.com',
//             pass: "itvptxxbnvqeudhn"
//         }
//       });

//       module.exports={saveMsjs,getMsjs,sendMail,sendSms,sendWhatsapp,deleteCartBuy}






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