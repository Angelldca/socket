const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');





const usuariosGet = async (req = request, res = response) => {
    const { limite = "5", desde = "0" } = req.query

  
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({ estado: true }),
        Usuario.find({ estado: true })
            .skip(Number(desde))
            .limit(Number(limite))
        
    ]);
    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body;

    const usuario = new Usuario({ nombre, correo, password, rol });
    // Verificar si el correo existe
    /* const existeEmail = await Usuario.findOne({correo});
     if( existeEmail){
         return res.status(400).json({
             msg: "El correo ya esta registrado"
         })
     }*/

    //Encriptar la contrasena
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt)

    //guardar en base de datos
    await usuario.save();

    res.json({
        msg: 'Post api',
        usuario
    })
}
const usuariosPut = async (req = request, res = response) => {
    const id = req.params.id;
    const { _id, password, google, ...resto } = req.body;

    //validar en vase de datos

    if (password) {
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json({
        msg: 'Put api',
        id,
        usuario
    })
}
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'Patch api'
    })
}
const usuariosDelete = async (req, res = response) => {
    const { id} = req.params;
   // const uid = req.uid;
   // const usuarios = await Usuario.findByIdAndDelete(id)   Eliminar fisicamente un 
                                                          // usuario de la base de datos
   const usuario =await Usuario.findByIdAndUpdate(id, {estado: false});
  const userAuth = req.usuario;
    res.json({usuario})
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}