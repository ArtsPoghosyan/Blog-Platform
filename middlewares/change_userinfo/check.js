const UserModel = require("../../models/UserModel");
const bcrypt = require("bcrypt");

async function checkPassword(data, req, res, next){
    try{
        const {oldPassword} = req.body;

        const user = await UserModel.getUserById(data.userId);
        if(!user){
            return res.status(404).json({message: "not found user"});
        }
        if(!bcrypt.compareSync(oldPassword, user.password)){
            return res.status(400).json({type: "password", message: "not valid old password"});
        }
        next(user);
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}

async function checkEmail(data, req, res, next){
    try{
        const {email} = req.body;

        const user = await UserModel.getUserById(data.userId);
        if(!user){
            return res.status(404).json({message: "not found user"});
        }
        if(await UserModel.getUserByEmail(email)){
            return res.status(400).json({type: "email", message: "there is already this email"});
        }
        next({data, user});
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}

module.exports = {checkPassword, checkEmail};