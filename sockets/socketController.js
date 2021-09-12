const { Socket } = require("socket.io");
const { comprobarJWt } = require("../helpers/generarJwt");
const ChatMensajes = require('../models/chat-mensajes')


const chatMensajes = new ChatMensajes();

const socketController = async(socket= new Socket(), io)=>{
  
  const token = socket.handshake.headers['x-token'];
 const usuario = await comprobarJWt(token);
 if(!usuario){
   return socket.disconnect();
 }

 //add usuarios
 chatMensajes.conectarusuario(usuario);
 io.emit('usuarios-activos', chatMensajes.usuariosArr);
 socket.emit('recibir-mensajes',chatMensajes.ultimos10);
//conectarlo a una sala especial
socket.join(usuario.id);// io->gloabal, socket.id, otra sala por el usuario.id


 socket.on('disconnect',()=>{ 
   chatMensajes.desconectarUsuario(usuario.id);
   io.emit('usuarios-activos', chatMensajes.usuariosArr);
  })
  socket.on('enviar-mensaje',({mensaje,uid})=>{

    if(uid){
      //es un mensaje prvado
      socket.to(uid).emit('mensaje-privado',{de: usuario.nombre, mensaje})
    }
    chatMensajes.enviarMensajes(usuario.id, usuario.nombre, mensaje);
    io.emit('recibir-mensajes',chatMensajes.ultimos10);
  })
  socket.on('escribiendo',(payload)=>{
     console.log(payload);
     
  })
}



module.exports = {
    socketController
}
