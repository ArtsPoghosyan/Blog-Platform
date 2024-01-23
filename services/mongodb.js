const mongoose = require("mongoose");

const {MONGODB_URL} = process.env;

(async function(){
    try{
        await mongoose.connect(MONGODB_URL);
        console.log("Database Connected");
    }catch(err){
        console.error(err);
    }
})();

module.exports = mongoose;