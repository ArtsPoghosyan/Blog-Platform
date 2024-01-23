const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const IP = require("ip");
const generator = require('generate-password');

const UserModel = require("../models/UserModel");
const TokenModel = require("../models/TokenModel");
const {transporter, confirmOptions, forgotOptions} = require("../services/nodemailer");

const {JWT_SECRET} = process.env;

class UserController{
    static login = async ({_id}, req, res, next)=>{
        try{
            const token = jwt.sign({_id}, JWT_SECRET);
            await TokenModel.addToken({userId: _id, userToken: token, userIp: bcrypt.hashSync(IP.address(), 8)});
            res.cookie('token', token);
            return res.status(200).json({message: "login is succesfully"});
        }catch(err){
            return next(err);
        }
    }
    static register = async (req, res, next)=>{
        try{
            const {password, email, name} = req.body;
            const activateKey = Math.random().toString().substring(2, 6);
            await UserModel.createUser({name, email, password: bcrypt.hashSync(password, 8), activateKey, auth: {succesAddress: [bcrypt.hashSync(IP.address(), 8)], lognnedKeys: []}});
            await transporter.sendMail(confirmOptions(email, activateKey));
            return res.status(200).json({message: 'register is succesfully'});
        }catch(err){
            return next(err);
        }
    }
    static logout = async (data, req, res, next)=>{
        try{
            await TokenModel.removeToken(data._id);
            res.clearCookie("token");
            return res.status(200).json({message: 'logout is succesfully'});
        }catch(err){
            next(err);
        }
    }
    static confirmEmail = async(req, res, next)=>{
        try{
            const {activateKey, email} = req.params;
            const user = await UserModel.getUserByEmail(email);
            if(!user){
                return res.status(404).json({message: "user didn't register"});
            }
            if(user.isActive){
                return res.status(200).json({message: "you are already approved"});
            }
            if(user.activateKey === activateKey){
                await UserModel.confirmUser(user._id);
                return res.status(200).json({message: "user successfully is confirm"});
            }
            return res.status(400).json({type: "key", message: "verification failed"});
        }catch(err){
            return next(err);
        }
    }
    static forgot = async({_id, email}, req, res, next)=>{
        try{
            const newPassword = generator.generate({length: 12, numbers: true, symbols: true});
            await transporter.sendMail(forgotOptions(email, newPassword));
            const hashPassword = bcrypt.hashSync(newPassword, 8);

            await UserModel.changePassword(_id, hashPassword);
            return res.status(200).json({message: "password succesfully changed and sent to e-mail"});
        }catch(err){
            return next(err);
        }
    }
    static receiveNewKey = async(req, res, next)=>{
        try{
            const {email} = req.body;
            const user = await UserModel.getUserByEmail(email);
            if(!user){
                return res.status(404).json({message: "user didn't register"});
            }
            if(!user.isActive){
                await transporter.sendMail(confirmOptions(email, user.activateKey));
                return res.status(200).json({message: "new key already sent to e-mail"});
            }
            return res.status(400).json({message: "you are already approved"});
        }catch(err){
            return next(err);
        }
    }
}

module.exports = UserController;