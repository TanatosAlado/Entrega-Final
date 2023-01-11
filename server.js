const express=require("express");
const{Server:http}=require ("http");
const {Server:ioServer}=require ("socket.io");
const User=require("./src/schema/schemaUser.js")
const session =require("express-session")
const MongoStore=require("connect-mongo");
const LocalStrategy = require('passport-local').Strategy;
const passport = require("passport");
const { comparePassword, hashPassword } = require("./src/services/utils")
const { Types } = require("mongoose");
const {saveMsjs, getMsjs, sendWhatsapp, sendMail, sendSms,deleteCartBuy}=require ("./public/js/send")
const nodemailer= require('nodemailer');
const { argv0 } = require("process");
const { db } = require("./src/schema/schemaProducts.js");

const {routerCarrito} = require("./src/routes/carros")
const {routerProducto} = require("./src/routes/productos")
const {routerMensajes} = require("./src/routes/mensajes")

//="="="="="=""="=="="="==""="

const {
  loggerDev,
  loggerProd
} = require("./src/loggers/logger_config");

const NODE_ENV = process.env.NODE_ENV || "development";
const logger = NODE_ENV === "production"
? loggerProd
: loggerDev

const cluster = require("cluster");
const {cpus} = require('os');
const cons = require("consolidate");
const cpuNum = cpus().length;

const modoCluster = false;

console.log(`node ${NODE_ENV}`)

if(modoCluster){
  console.log("Se iniciará en modo CLUSTER")
}
else{
  console.log("Se iniciará en modo FORK")
}

if (modoCluster && cluster.isPrimary) {
  console.log(`Cluster iniciado. CPUS: ${cpuNum}`);
  console.log(`PID: ${process.pid}`);
  for (let i = 0; i < cpuNum; i++) {
    cluster.fork();
  }

  cluster.on("exit", worker => {
    console.log(`${new Date().toLocaleString()}: Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = express();
  const httpserver = http(app)
  const io = new ioServer(httpserver)


//----------
var engines= require("consolidate")
app.engine("html", engines.swig)
app.set("view engine", "html")


// Inicio Handlebars
const handlebars = require("express-handlebars");

const hbs = handlebars.create({
  extname: ".hbs",
  defaultLayout: "index.hbs",
  layoutsDir: __dirname + "/views",
});

app.engine("hbs", hbs.engine);
app.set('views', "./Views");
app.set("view engine", "hbs");

// Fin Handlebars


//--------------
  
  app.use("/public", express.static('./public/'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/productos', routerProducto);
  app.use('/carritos', routerCarrito);
  app.use('/mensajes', routerMensajes);
  

  app.use(session({
    secret: 'TanatosAlado',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl:process.env.URL_BD,
      retries: 0,
      ttl: process.env.TIME,
    }),
  })
  );
  
  
  app.use(passport.initialize());
  app.use(passport.session());
  
   //   //RECUPERO EL NOMBRE YA EN SESION INICIADA
   app.get('/loginEnv', (req, res) => {
    process.env.USER=req.user.name;
    process.env.avatar=req.user.avatar;
    const user = process.env.USER;
    const avatar=process.env.avatar;
    res.send({
        user,avatar
    })
    
  })
  
  
   //   //RECUPEROel ID DeL CARRO EN SECION INICIADA
   app.get('/idCart', (req, res) => {
    process.env.USER=req.user.name;
    process.env.id=req.user.id;
    process.env.avatar=req.user.avatar
    const user = process.env.USER;
    const id=process.env.id
    const avatar=process.env.avatar
    res.send({
        user,id,avatar
    })
    
  })
  
  
  //RECUPERO EL NOMBRE YA EN SESION INICIADA
  app.get('/getUserNameEnv', (req, res) => {
    const user = process.env.USER;
    
      res.send({
        user
    })
  })
  
  app.get("/", (req,res)=>{
  
      try{
          if (req.session.user){
             res.sendFile(__dirname + ('/public/index.html'))
             logger.log("info",`Ingreso a la ruta${req.url}`)
          }
          else
          {
              res.sendFile(__dirname + ('/views/login.html'))
              logger.log("info",`Ingreso a la ruta${req.url}`)
          }
      }
      catch (error){
       console.log(error)
      }
  
  })
  
  io.on('connection', async (socket) => {
      console.log('Usuario conectado');
      socket.on('enviarMensaje', (msj) => {
          saveMsjs(msj);
      })
  
      socket.emit ('mensajes', await getMsjs());
  })
  
  // // DESLOGUEO DE USUARIO
  
  app.get('/logout', (req, res) => {
      try {
          req.session.destroy((err) => {
              if (err) {
                  console.log(err);
              } else {
                  res.redirect('/logout');
                  logger.log("info",`Ingreso a la ruta${req.url}`)
              }
          })
      } catch (err) {
          console.log(err);
      }
  })
  app.get('/logoutMsj', (req, res) => {
      try {
          res.sendFile(__dirname + '/views/logout.html');
          logger.log("info",`Ingreso a la ruta${req.url}`)
      }
      catch (err) {
          console.log(err);
      }
  })

//-------------------------------

app.get('/buyCart', async(req, res) => {
  try{
  process.env.USER=req.user.mail;
  process.env.id=req.user.id;
  process.env.name=req.user.name
  process.env.phone=req.user.phone
  process.env.address=req.user.address
   const id=parseInt( process.env.id)
  const productos=await db.collection("carts").findOne({id:id})
  const mail = process.env.USER;
  const direction=process.env.address
  const name= process.env.name
  sendMail(id,name,mail,JSON.stringify(productos),direction)
  deleteCartBuy(id)
  res.redirect("/buySuccesfull")
  logger.log("info",`Ingreso a la ruta${req.url}`)
  

   }
  catch(err){
    console.log(err)
  }
})

//-------------------------------




   
    app.get("/login", (req, res) => {
      res.sendFile(__dirname + "/views/login.html");
      logger.log("info",`Ingreso a la ruta${req.url}`)
    });
  
    app.get("/signup", (req, res) => {
      res.sendFile(__dirname + "/views/register.html");
      logger.log("info",`Ingreso a la ruta${req.url}`)
    });
  
    app.get("/loginFail", (req, res) => {
      res.sendFile(__dirname + "/views/loginFail.html");
      logger.log("info",`Ingreso a la ruta${req.url}`)
    });
  
    app.get("/signupFail", (req, res) => {
      res.sendFile(__dirname + "/views/signupFail.html");
      logger.log("info",`Ingreso a la ruta${req.url}`)
    });
    app.get("/cart", (req, res) => {
      res.sendFile(__dirname + "/views/cart.html");
      logger.log("info",`Ingreso a la ruta${req.url}`)
    });

    app.get("/chat", (req, res) => {
      res.sendFile(__dirname + "/views/messages.html");
      logger.log("info",`Ingreso a la ruta${req.url}`)
    });
  
//---------------------------------------------------------
    
app.get("/datos", (req, res) => {

  res.render("index.hbs")
  logger.log("info",`Ingreso a la ruta${req.url}`)
});
//---------------------------------------------------------

    app.get("/buySuccesfull", (req, res) => {
      res.sendFile(__dirname + "/views/buyCart.html");
      logger.log("info",`Ingreso a la ruta${req.url}`)
    });

    app.get("/error", (req, res) => {
      res.render("error.ejs",{error:"Error! Alguno de los datos es incorrecto"})
      logger.log("info",`Ingreso a la ruta${req.url}`)
    });

//----------------------------------------------------------
  
    app.post("/signup", passport.authenticate("signup", {
      failureRedirect: "/error",
    }) , (req, res) => {  
      req.session.user = req.user;
      res.redirect("/login");
    });
    
    app.post("/login", passport.authenticate("login", {
      failureRedirect: "/error",
    }) ,(req, res) => {
        req.session.user = req.user;
        res.redirect('/cart');
    });

    app.get("/info", (req, res) => {
      res.render("infoServer.pug",{PID:process.pid,VERSION:process.version,MEMORIA:process.memoryUsage().rss,SISTEMAOPERATIVO:process.platform,CARPETA:process.cwd(),PATH:process.argv[0]});
      logger.log("info",`Ingreso a la ruta${req.url}`)
    });
  
    app.get("*", (req, res) => {
      logger.log("warn",`Ruta no encontrada ${req.url}`)
      res.status(400).send(`Ruta no encontrada ${req.url}`);
    });
  
    const PORT = process.env.PORT;
  
    const server = httpserver.listen(PORT, () => {
        console.log(`Server is running on port: ${server.address().port}`);
    });
    server.on('error', error => console.log(`error running server: ${error}`));
  
  
}


//="="="="="=""="=="="="==""="

