
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario');
const generarJwt = (uid = '') => {

    return new Promise((resolve, reject) => {
        const paylod = { uid };
        jwt.sign(paylod, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject("no se pudo generar el jwt");
            } else {
                resolve(token);
            }
        })

    });
}

const comprobarJWt = async(token) => {
    try {
        if (token.length < 10)
            return null;
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);
        if (usuario && usuario.estado)
            return usuario;
        else {
            return null;
        }

    } catch (error) {
        return null;
    }
}
module.exports = {
    generarJwt,
    comprobarJWt
}