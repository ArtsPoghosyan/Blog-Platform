const UserModel = require("../../models/UserModel");

module.exports = async function check(req, res, next){
    try{
        const {email} = req.body;

        const user = await UserModel.getUserByEmail(email);

        if(!user){
            return res.status(404).json({message: "not found user"});
        }
        if(!user.isActive){
            return res.status(400).json({type: "confirm", message: "you didn't confirm your email"});
        }

        return next(user);
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}