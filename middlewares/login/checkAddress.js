const UserModel = require("../../models/UserModel");
const {transporter, loginKeyOptions} = require("../../services/nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const IP = require("ip");

const {JWT_SECRET} = process.env;

module.exports = async function checkAddress(user, req, res, next){
    try{
        const ip = IP.address();
        const auth = user.auth;
        
        if(auth.succesAddress.some((evt)=> bcrypt.compareSync(ip, evt))){
            return next(user);  
        }

        const key = (Math.random() + "").substring(2, 8);
        const expiresToken = jwt.sign({ip, key}, JWT_SECRET, {expiresIn: "30min"});

        await UserModel.loginSucces(user._id, {...auth, lognnedKeys: [...auth.lognnedKeys, {key, expiresToken}]});
        await transporter.sendMail(loginKeyOptions(user.email, key));

        return res.status(303).json({messsage: "key for login already sent to e-mail"});
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}