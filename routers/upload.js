const { Router, response } = require('express');
const { check } = require('express-validator');
const { getUploads, updateImg, mostrarImg, updateImgCloudinary, mostrarImgCloudinary } = require('../controllers/uploadController');
const fileUpload = require('express-fileupload');
const { validarcampos } = require('../middlewares/validarCampos');
const { coleccionespermitidas } = require('../helpers');

const router = Router();

router.use(fileUpload({
    useTempFiles : true,
    createParentPath:true,
    tempFileDir : '/tmp/'
}));
router.post('/', getUploads);

router.put('/:coleccion/:id',[
    check('id',"Debe ser un id de mongo").isMongoId(),
    check('coleccion').custom(c=> coleccionespermitidas(c, ['usuarios','productos'])),
    validarcampos
],updateImgCloudinary)
//], updateImg);


router.get('/:coleccion/:id',[
    check('id',"Debe ser un id de mongo").isMongoId(),
    check('coleccion').custom(c=> coleccionespermitidas(c, ['usuarios','productos'])),
    validarcampos
//],mostrarImg)
],mostrarImgCloudinary)



module.exports = router