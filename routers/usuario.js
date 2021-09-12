const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGet,
     usuariosPost,
     usuariosDelete,
     usuariosPatch,
     usuariosPut } = require('../controllers/usuario');


const { esRoleValido, existeUsuarioPorId, emailValidator } = require('../helpers/db-validators');

const { validarcampos } = require('../middlewares/validarCampos');
const { validarJwt } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');


const router = Router();

router.get('/', usuariosGet);
router.put('/:id', [
     check('id', "no es una ID valido").isMongoId(),
     check('id').custom(existeUsuarioPorId),
     check('rol').custom(esRoleValido),
     validarcampos
], usuariosPut);
router.post('/', [
     check('correo', "El correo no es valido").isEmail(),  //Revisar campo del body
     check('correo').custom(emailValidator),
     check('nombre', "El nombre es obligatorio").not().isEmpty(),
     check('password', "El password es obligatorio y mayor de 6 letras").isLength({ min: 6 }),
     //check('rol', "El rol no es valido").isIn(['ADMIN_ROLE','USER_ROLE']),
     check('rol').custom(esRoleValido),
     validarcampos
], usuariosPost);
router.delete('/:id',[
     validarJwt,
     esAdminRole,
     check('id', "no es una ID valido").isMongoId(),
     check('id').custom(existeUsuarioPorId),
     validarcampos
    
], usuariosDelete);
router.patch('/', usuariosPatch);



module.exports = router;