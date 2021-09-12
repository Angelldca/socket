const { Router}= require('express');
const { check} = require('express-validator');
const { authPost, authPostGoogle, renovarToken } = require('../controllers/auth');
const { validarJwt } = require('../middlewares/validar-jwt');
const { validarcampos } = require('../middlewares/validarCampos');


const router = Router();

router.post('/login',[
    check('correo',"El correo es obligatorio").isEmail(),
    check('password',"El password es obligatorio").not().isEmpty(),
    validarcampos
],authPost);


router.post('/login/google',[
    check('id_token',"El token es obligatorio").not().isEmpty(),
    validarcampos
],authPostGoogle);

router.get('/',validarJwt,renovarToken);

module.exports = router