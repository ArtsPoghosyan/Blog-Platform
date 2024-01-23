const Joi = require("@hapi/joi");

async function passwordValidator(data, req, res, next){
    try{
        const {oldPassword, newPassword} = req.body;
        const Schema = Joi.object({
            oldPassword: Joi.string().min(6).max(100).required(),
            newPassword: Joi.string().min(6).max(100).required(),
        });
        const {error} = Schema.validate({oldPassword, newPassword});
        if(error){
            return res.status(400).json({...error, type: "validation"});
        }
        next(data);
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}

async function nameValidator(data, req, res, next){
    try{
        const {newName} = req.body;
        const Schema = Joi.object({
            newName: Joi.string().min(3).max(10).required()
        });
        const {error} = Schema.validate({newName});
        if(error){
            return res.status(400).json({...error, type: "validation"});
        }
        next(data);
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}

async function emailValidator(data, req, res, next){
    try{
        const {email} = req.body;
        const Schema = Joi.object({
            email: Joi.string().min(10).max(100).required().email(),
        });
        const {error} = Schema.validate({email});
        if(error){
            return res.status(400).json({...error, type: "validation"});
        }
        next(data);
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}

module.exports = { passwordValidator, nameValidator, emailValidator };