const { request } = require("express");
const { response } = require("express");
const { validationResult } = require("express-validator");

const Usuario = require("../models/Usuario");
const bcrypt =require("bcryptjs");
const { db } = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req = request, res = response) => {
  const { email, name, password } = req.body;

  try {
    //Verificar el email

    const usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario y aexiste con ese email",
      });
    }

    // Crear usuario con el modelo
    const dbUser = new Usuario(req.body);

    // Hashear la contraseña
    const salt =bcrypt.genSaltSync(10);
    dbUser.password=bcrypt.hashSync(password, salt);

    //Generar el JWT
    const token = await generarJWT(dbUser.id,name,email);

    //const token= await generarJWT(dbUser.id,name)

    //Crear usuario de DB
    await dbUser.save();

    //Generar respuesta exitosa

    return res.status(201).json({
      ok: true,
      uid: dbUser.id,
      name,
      email:email,
      token
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }

 
};

const loginUsuario =  async(req = request, res = response) => {
  const { email, password } = req.body;
  try{

    const dbUser= await Usuario.findOne({email});
    if(!dbUser){
      return res.status(400).json({
        ok:false,
        msg:"El correo no existe"
      })
    }

    //Confirmas si el password hace match 
    const validPassword=bcrypt.compareSync(password, dbUser.password);
    if(!validPassword){
      return res.status(400).json({
        ok:false,
        msg:"El password no existe"
      })
    }

    //Genera el JWT

    const token= await generarJWT(dbUser.id,dbUser.name);

    //Respuesta del servicio

    return res.json({
      ok:true,
      uid:dbUser.id,
      name:dbUser.name,
      email:dbUser.email,
      token
    })


  } catch(error){
    console.log(error);
    return res.status(500).json({
      ok:false,
      msg:"hable con el administrador"
    })
  }

};

const validarToken =  async(req=request, res = response) => {

  const {uid}=req;

  //Leer la base de datos 
  const dbUser= await Usuario.findById(uid);




  //Generar JWT
  const token= await generarJWT(uid,dbUser.name);


  return res.json({
    ok: true,
    uid:uid,
    name:dbUser.name,
    email:dbUser.email,
    token
    
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  validarToken,
};
