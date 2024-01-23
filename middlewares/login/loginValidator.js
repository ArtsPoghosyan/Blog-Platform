const Joi = require("@hapi/joi");

function loginValidator(req, res, next){
    try{
        const {email, password} = req.body;
        const Schema = Joi.object({
            email: Joi.string().min(10).max(100).required().email(),
            password: Joi.string().min(6).max(100).required()
        })
        const {error} = Schema.validate({email, password});
        if(error){
            return res.status(400).json({...error, type: "validation"});
        }
        next();
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}
function loginOtherValidator(req, res, next){
    try{
        const {email, password, key} = req.body;
        const Schema = Joi.object({
            email: Joi.string().min(10).max(100).required().email(),
            password: Joi.string().min(6).max(100).required(),
            key: Joi.string().length(6).required()
        })
        const {error} = Schema.validate({email, password, key});
        if(error){
            return res.status(400).json({...error, type: "validation"});
        }
        next();
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}
function confirmValidation(req, res, next){
    try{
        const {email, activateKey} = req.params;
        const Schema = Joi.object({
            email: Joi.string().min(10).max(100).required().email(),
            activateKey: Joi.string().required(),
        })
        const {error} = Schema.validate({email, activateKey});
        if(error){
            return res.status(400).json({...error, type: "validation"});
        }
        next();
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}

module.exports = {loginValidator, loginOtherValidator, confirmValidation}