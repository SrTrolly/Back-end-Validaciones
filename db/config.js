const mongoose=require("mongoose")

const dbConnection= async()=>{
    try{

        await mongoose.connect(process.env.BD_CNN);

        console.log("DB online")

    } catch(error){
        console.log(error);
        throw new Error("El error a la hora de inicializ DB");
    }
}


module.exports={
    dbConnection
}