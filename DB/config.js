const mongoose = require('mongoose');

 const dbConnections = async()=>{
     try{
        await mongoose.connect(process.env.MONGOODB_CNN, {
             useNewUrlParser: true,
             useUnifiedTopology:true,
             useCreateIndex:true,
             useFindAndModify:false, 
         });
         console.log("Bases de datos online");
     }catch(err){
         console.log(err)
         
       //  throw new Error('Error a la hora de iniciar la base de datos')
     }
}

module.exports = {
    dbConnections
}
