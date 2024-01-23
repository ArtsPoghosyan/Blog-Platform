const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");
const TokenModel = require("../models/TokenModel");
const { transporter, confirmOptions } = require("../services/nodemailer");

class UserController{
    static getUser = async ({userId}, req, res, next)=>{
        try{
            const user = await UserModel.getUserById(userId);
            if(!user){
                return res.status(404).json({message: "not found"});
            }
            user.password = null;
            user.auth = null;
            return res.status(200).json({message: "found", user});
        }catch(err){
            return next(err);
        }
    }
    static removeUser = async ({_id, userId}, req, res, next)=>{
        try{
            await UserModel.removeUser(userId);
            await TokenModel.removeToken(_id);
            res.clearCookie("token");
            return res.status(200).json({message: 'delete is succesfully'});
        }catch(err){
            return next(err);
        }
    }
    
    static changePassword = async({_id}, req, res, next)=>{
        try{
            const {newPassword} = req.body;
            const hashPassword = bcrypt.hashSync(newPassword, 8);
            const user = await UserModel.changePassword(_id, hashPassword);
            user.password = null;
            user.auth = null;
            return res.status(200).json({message: "password succesfully changed", user});
        }catch(err){
            return next(err);
        }
    }
    static changeName = async({userId}, req, res, next)=>{
        try{
            const {newName} = req.body;
            const user = await UserModel.updateUser(userId, {name: newName});
            user.password = null;
            user.auth = null;
            return res.status(200).json({message: "name succesfully changed", user});
        }catch(err){
            return next(err);
        }
    }
    static changeEmail = async({data, user}, req, res, next)=>{
        try{
            const {email} = req.body;

            const activateKey = Math.random().toString().substring(2, 6);

            await UserModel.updateUser(user._id, {email, activateKey, isActive: false});
            await TokenModel.removeToken(data._id); 
            await transporter.sendMail(confirmOptions(email, activateKey));

            res.clearCookie("token");
            return res.status(200).json({message: "email succesfully changed"});
        }catch(err){
            return next(err);
        }
    }
}

module.exports = UserController;