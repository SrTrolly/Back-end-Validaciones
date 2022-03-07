const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./db/config");
const path=require("path")
require("dotenv").config();

console.log(process.env);

//Crear el servidor/aplicacion de express

const app = express();

//Base de datos
dbConnection();

//Directorio publico
app.use(express.static("public"));

// CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use("/api/auth", require("./routes/auth")); // con esto definimos el camino de las rutas, para ingresar a esa path debe tener antes al api auth

//Manejar 
app.get("*",(req,res)=> res.sendFile(path.resolve(__dirname,"public/index.html")) )

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
