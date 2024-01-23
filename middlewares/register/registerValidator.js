const Joi = require("@hapi/joi");

module.exports = function registerValidator(req, res, next){
    try{
        const {name, email, password} = req.body;
        const Schema = Joi.object({
            name: Joi.string().min(3).max(10).required(),
            email: Joi.string().min(10).max(100).required().email(),
            password: Joi.string().min(6).max(100).required()
        })
        const {error} = Schema.validate({name, email, password});
        if(error){
            return res.status(400).json({...error, type: "validation"});
        }
        next();
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}