const UserModel = require("../../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const IP = require("ip");

const {JWT_SECRET} = process.env;

module.exports = async function checkNewClientAddress(user, req, res, next){
    try{
        const {key} = req.body; 
        const auth = user.auth;
        const ip = IP.address();

        if(auth.succesAddress.some((evt)=> bcrypt.compareSync(ip, evt))){ // can is be OR can't be
            return next(user);  
        }

        const thisKey = auth.lognnedKeys.filter((evt)=> evt.key === key);
        if(thisKey){
            if(jwt.verify(thisKey[0].expiresToken, JWT_SECRET)){
                await UserModel.loginSucces(user._id, {...auth, succesAddress: [...auth.succesAddress, bcrypt.hashSync(ip, 8)], lognnedKeys: auth.lognnedKeys.filter((evt)=> evt.key !== key)});
                return next(user);
            }
            await UserModel.loginSucces(user._id, {...auth, succesAddress: auth.succesAddress, lognnedKeys: auth.lognnedKeys.filter((evt)=> evt.key !== key)});
            return res.status(400).json({type: "key time", messsage: "key time has passed"});
        }

        return res.status(400).send({type: "key", messsage: "key isn't right"});
    }catch(err){
        if(err.expiredAt){
            try{
                await UserModel.loginSucces(user._id, {...auth, succesAddress: auth.succesAddress, lognnedKeys: auth.lognnedKeys.filter((evt)=> evt.key !== key)});
                return res.status(400).json({type: "key time", messsage: "key time has passed"});
            }catch(error){
                return res.status(500).json({error: process.env['MODE'] === "development" ? error || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
            } 
        }
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}