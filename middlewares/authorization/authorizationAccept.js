const TokenModel = require("../../models/TokenModel");
const bcrypt = require("bcrypt");
const IP = require("ip");

module.exports = async function authorizationAccept(req, res, next){
    try{
        const {token} = req.cookies;
        if(token){
            const userToken = await TokenModel.getInfoByToken(token);
            if(userToken){
                if(bcrypt.compareSync(IP.address(), userToken.userIp)){
                    return next(userToken);
                }
            }
            res.clearCookie("token");
        }
        return res.status(401).json({message: "user unauthorized"});
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}