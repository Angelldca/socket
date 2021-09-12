const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL ); 
const { response, request } = require('express');
const { subirArchivo } = require('../helpers');
const Usuario = require('../models/usuario')
// default options


 


const getUploads = async (req = request, res= response)=>{
     

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res.status(400).send({msg: 'No files were uploaded.'});
  }
try{
    const nombre = await subirArchivo(req.files,undefined,'img');
    res.json({
        nombre
    })
   
   
}catch(err){
    res.status(400).json({err})
    
}
 
}
 

const updateImg = async(req=request,res=response)=>{
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).send({msg: 'No files were uploaded.'});
      }
    const { id, coleccion} =req.params

    let modelo;
    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(500).json({
                    msg:`no existe un usuario con el id ${id}`
                })
            }

        break;
        default:
            return res.status(500).json({
                msg:"se me olvido validar eso"
            })
    }

    //Limpiar img viejas
    if(modelo.img){
          const imgPath = path.join(__dirname,'../uploads',coleccion,modelo.img);
          if(fs.existsSync(imgPath)){
              fs.unlinkSync(imgPath);
          }
    }

          modelo.img = await subirArchivo(req.files,undefined,coleccion);
          await modelo.save();
   res.json({
      modelo
   })
}
 

const mostrarImg = async (req= request,res= response)=>{
   
    const { id, coleccion} =req.params;

    let modelo;
    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
           // console.log(modelo);
            if(!modelo){
                return res.status(400).json({
                    msg:`no existe un usuario con el id ${id}`
                })
            }

        break;
        default:
            return res.status(500).json({
                msg:"se me olvido validar esto"
            })
    }

    //Limpiar img viejas
    if(modelo.img){
          const imgPath = path.join(__dirname,'../uploads',coleccion,modelo.img);
          if(fs.existsSync(imgPath)){
            // console.log(imgPath);
            return res.sendFile(imgPath)
          }
    }

         
    res.sendFile(path.join(__dirname,'../assets','m3.png'))
}
//mostrar img cloudinary
const mostrarImgCloudinary = async (req= request,res= response)=>{
   
    const { id, coleccion} =req.params;

    let modelo;
    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
           // console.log(modelo);
            if(!modelo){
                return res.status(400).json({
                    msg:`no existe un usuario con el id ${id}`
                })
            }

        break;
        default:
            return res.status(500).json({
                msg:"se me olvido validar esto"
            })
    }

    //Limpiar img viejas
    if(modelo.img){
          //const imgPath = path.join(__dirname,'../uploads',coleccion,modelo.img);
            return res.redirect(modelo.img);
         
    }

         
    res.sendFile(path.join(__dirname,'../assets','m3.png'))
}
//cloudinary

const updateImgCloudinary = async(req=request,res=response)=>{
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).send({msg: 'No files were uploaded.'});
      }
    const { id, coleccion} =req.params

    let modelo;
    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(500).json({
                    msg:`no existe un usuario con el id ${id}`
                })
            }

        break;
        default:
            return res.status(500).json({
                msg:"se me olvido validar eso"
            })
    }

    //Limpiar img viejas
    if(modelo.img){
         const nombreArr = modelo.img.split('/');
         const nombre = nombreArr[nombreArr.length - 1];
         const [public_id] = nombre.split('.');
         console.log(public_id)
          cloudinary.uploader.destroy(public_id);
    }
  const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    
    modelo.img = secure_url;
    

         // modelo.img = await subirArchivo(req.files,undefined,coleccion);
    await modelo.save();
   res.json(modelo)
}

module.exports = {
    getUploads,
    updateImg,
    mostrarImg,
    updateImgCloudinary,
    mostrarImgCloudinary
    
}
