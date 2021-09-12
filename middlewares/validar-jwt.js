const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const  Usuario = require('../models/usuario');
const validarJwt = async (req= request,res = response,next)=>{

      const token = await req.header('x-token');
      if(!token){
        return res.status(401).json({
             msg:" not token"
         })
      }

      try{
              
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
           // leer usuario uid 
           const usuario = await Usuario.findById(uid);

           if(!usuario){
            return res.status(401).json({
                msg: "token no valido usuario no existe"
            })
        }
           
           if(!usuario.estado){
               return res.status(401).json({
                   msg: "token no valido usuario inactivo"
               })
           }
           req.usuario = usuario;
        next();
      }catch(err){
          console.log(err);
        return res.status(401).json({
            msg:" token no valido"
        })
     }
 
      }


module.exports = {validarJwt}