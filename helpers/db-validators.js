
const { Error } = require('mongoose');
const Role = require('../models/role');
const Usuario = require('../models/usuario');
const esRoleValido =  async(rol="") =>{
    const existeRol = await Role.findOne({rol});
    if( !existeRol){
         throw new Error(`El role: ${rol} no es correcto`)
    }
}
const emailValidator = async(correo)=>{
    const existeEmail = await Usuario.findOne({correo});
    if( existeEmail){
        throw new Error(`El correo: ${correo} ya existe`)
    }
    
}
const existeUsuarioPorId = async(id)=>{
    const existeUsuario = await Usuario.findById(id);
    if( !existeUsuario){
        throw new Error(`El id: ${id} no existe`)
    }
    
}
const coleccionespermitidas =  (coleccion='',colecciones=[])=>{
     const incluidas = colecciones.includes(coleccion);
     if(!incluidas){
         throw new Error(`la ${coleccion} no es permitida; ${colecciones}`)
     }
     return true;
}

module.exports = {
    esRoleValido,
    emailValidator,
    existeUsuarioPorId,
    coleccionespermitidas
}