const express = require('express');
const cors = require('cors');
const router = require('../routers/usuario');
const routerauth = require('../routers/auth');
const routerUpload =  require('../routers/upload');
const { dbConnections } = require('../DB/config');
const { socketController } = require('../sockets/socketController');
//require('dotenv');
class Server {
    constructor() {
        this.app = express();
         this.port = process.env.PORT;
         this.usuariosPath = '/api/usuario';
         this.authPath = '/api/auth';
         this.upload = '/api/upload';

         this.server = require('http').createServer(this.app);
         this.io = require('socket.io')(this.server);
         //this.listen();
            //Conectar base de datos
            this.conectarDb();
         //middelweres
     this.middelwere();
         //rutas
        this.routes();
        this.sockets();
    }

   async conectarDb(){
       
           await dbConnections()
    }
       
    middelwere(){
        this.app.use(express.static('public'));
        //cors
        this.app.use(cors());
        //Lectura y parseo de body
        this.app.use(express.json())
        
    }
    //rutas
    routes() {
        this.app.use(this.usuariosPath, router);
        this.app.use(this.authPath, routerauth);
        this.app.use(this.upload, routerUpload);
    }
    //sockets
    sockets(){
        this.io.on('connection', (soket)=>socketController(soket,this.io));
    }
    listen() {

        this.server.listen(this.port, () => {
            console.log("servidor corriendo en el puerto :", this.port);
        });
    }
}


module.exports = Server
