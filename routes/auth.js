

const {Router}=require("express")
const { check } = require("express-validator");

const { crearUsuario, loginUsuario, validarToken } = require("../controllers/auth");
const { validarCampo } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");




const router= Router();

//Crar un nuevo usuario
router.post("/new",[
    check("name","El nombre es obligatorio").isEmpty(),
    check("email","El email es obligatorio").isEmail(),
    check("password","la contraseña es obligatoria").isLength({min:6})
    
],crearUsuario);

//Login de usuario

router.post("/",[
    check("email","El email es obligatorio").isEmail(),
    check("password","la constraseña es obligatoria").isLength({min:6})
],loginUsuario);


//Validar y revalidar token
router.get("/renew",validarJWT,validarToken);





module.exports=router;

