const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJwt } = require('../helpers/generarJwt');
const { googleVerify } = require('../helpers/googleVerify');
const axios = require('axios').default;




const authPost = async (req = request, res = response) => {
    const {correo, password} = req.body;

    try{
        //verificar si el email existe
   const usuario = await Usuario.findOne({correo});
   if(!usuario){
    return  res.status(400).json({
              msg:"El correo no existe en la data base"
          });
   }
        //Si el usuario esta activo
       
        if(!usuario.estado){
          return  res.status(400).json({
                msg:"usuario no activo"
            })
        }


        //verificar pass
        const validPassword = bcrypt.compareSync(password,usuario.password)
        if(!validPassword){
           return res.json({
                msg:"password incorrecta"
            })
        }
   
        // generar un jwt
        const token = await generarJwt(usuario.id);
       res.json({
           masg:"api/auth post",
           usuario,
           token
       })
    }catch(err){
        console.log(err)
         res.status(500).json({
            msg:"Hable con el admin"
        })
    }
    

}
// autenticar un usuario de google

const permitirUser = async (req = request,res= response,nombre,correo,img)=>{
    let usuario = await Usuario.findOne({correo});
    if(!usuario){
        const data ={
            nombre,
            correo,
            img,
            password: ':P',
            google:true,


        }
        usuario = new Usuario(data);
        await usuario.save()
     
    }

    if(!usuario.estado){
     res.status(401).json({
         msg:"usuario no autorizado",
       
    });
    }
    
       //generar un jwt
       const token = await generarJwt(usuario.id);
      res.json({
          msg:"token valido",
          usuario,
         token
     })
}
const authPostGoogle = async (req = request, res = response) => {
  const { id_token } =  req.body; 
  const { prod} = req.query
  
  
  try{
    
    if(prod){
        console.log("Estoy aqui")
        await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`)
        // .then(resp => resp.json() )
         .then( async data => {
             let correo = data.data.email;
             let nombre = data.data.name;
             let img = data.data.picture
             console.log("token valido ", nombre, correo, img)
             
         permitirUser(req,res,nombre,correo,img);
         
         })
         .catch(console.log);
    }
    else{
        const {correo, nombre, img} = await googleVerify(id_token);
        
        await permitirUser(req,res,nombre,correo,img);
        
    }
 
  //  
    /* */
  } catch(err){
      console.log(err);
      res.status(400).json({
          msg:"token de google no es valido"
      })
  }
  

    

}
const renovarToken = async(req,res = response)=>{
    const {usuario} = req;
    const token = await generarJwt(usuario.id);
    res.json({
        usuario,
        token
    })
}

module.exports = {
    authPost,
    authPostGoogle,
    renovarToken
}