const UserModel = require("../../models/UserModel");

module.exports = async function checkEmail(req, res, next){
    try{
        const {email} = req.body;
        
        const exsits = await UserModel.getUserByEmail(email);

        if(exsits){
            return res.status(400).json({type: "email", message: 'already there is user by this email'});
        }

        next();
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}