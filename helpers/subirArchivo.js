
const { response, request } = require('express');
const path = require('path')

const { v4: uuidv4} = require('uuid');
const subirArchivo = (files, extencionesValidas = ['jpg','png','gif','jpeg'],carpeta= "")=>{
     return new Promise((resolve,reject)=>{
        const {archivo} = files;
        const nombreCortado = archivo.name.split('.');
        console.log(nombreCortado[nombreCortado.length -1]);
        const extenciones = extencionesValidas;
        if( ! extenciones.includes(nombreCortado[nombreCortado.length -1])){
         return reject(
              `La extencion: .${nombreCortado[nombreCortado.length -1]} no está permitida; (${extenciones})`);
        }
        const nombreTemp = uuidv4() + '.' + nombreCortado[nombreCortado.length -1];
       const uploadPath = path.join( __dirname,'../uploads/' ,carpeta, nombreTemp)
        // Use the mv() method to place the file somewhere on your server
        archivo.mv(uploadPath, (err) => {
          if (err){
            return reject("vino un error: ",err);
          }
           
           
         resolve(nombreTemp);
        });
     })

   
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    
  }


  module.exports = {
    subirArchivo
  }