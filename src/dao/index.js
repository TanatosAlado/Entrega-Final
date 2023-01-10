const dotenv =require ('dotenv')
dotenv.config()

let productoDao
let cartDao
let userDao
let messagesDao


switch (process.env.DATABASE){
    case 'mongo':{
        const  ProductosDaoMongo =  require('./ProductsDao.js')
        const cartDaoMongo =  require('./cartDao.js')
        const userDaoMongo =  require('./userDao.js')
        const messageDaoMongo=require('./messagesDao.js')
        
        
        
       productoDao=ProductosDaoMongo;
       cartDao=cartDaoMongo;
       userDao=userDaoMongo;
       messagesDao=messageDaoMongo;
       break;
    }
}    

module.exports= {
    productoDao, cartDao,userDao, messagesDao
    }
