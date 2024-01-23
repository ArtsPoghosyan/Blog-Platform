const TokenModel = require("../../models/TokenModel");

module.exports = async function checkToken(user, req, res, next){
    try{
        const tokenVerify = await TokenModel.getInfoByUserId(user._id);

        if(tokenVerify){
            await TokenModel.removeToken(user._id);
        }
        next(user);
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}