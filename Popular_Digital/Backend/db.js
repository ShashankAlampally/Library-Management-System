const mongoose = require('mongoose');


module.exports =() =>{
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    try {
        mongoose.connect(process.env.DB,connectionParams);
        console.log("Connected to Database: " + connectionParams);
        
    } catch (error) {
        console.log(error);
        console.log("Error Occured during connecting with database")
    }
}