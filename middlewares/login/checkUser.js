const UserModel = require("../../models/UserModel");
const bcrypt = require("bcrypt");

module.exports = async function checkUser(req, res, next){
    try{
        const {email, password} = req.body;
        
        const user = await UserModel.getUserByEmail(email);

        if(!user){
            return res.status(404).json({message: "not found email or password"});
        }
        if(!user.isActive){
            return res.status(400).json({type: "confirm", message: "you didn't confirm your email"});
        }

        if(!bcrypt.compareSync(password, user.password)){
            return res.status(404).json({message: "not found email or password"});
        }
        next(user);
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}