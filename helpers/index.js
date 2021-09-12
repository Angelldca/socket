

const dbValidators = require('./db-validators');
const generarToken = require('./generarJwt');
const googleVer = require('./googleVerify');
const subirFile = require('./subirArchivo');



module.exports = {
    ...dbValidators,
   ...generarToken,
   ...googleVer,
   ...subirFile,
    
}