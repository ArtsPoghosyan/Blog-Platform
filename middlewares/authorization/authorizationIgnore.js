const TokenModel = require("../../models/TokenModel");
const bcrypt = require("bcrypt");
const IP = require("ip");

module.exports = async function authorizationIgnore(req, res, next){
    try{
        const {token} = req.cookies;
        if(token){
            const userToken = await TokenModel.getInfoByToken(token);
            if(userToken){
                if(bcrypt.compareSync(IP.address(), userToken.userIp)){
                    return res.status(403).json({message: "user with permission couldn't be on this router"});
                }
            }
            res.clearCookie("token");
        }
        next();
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}