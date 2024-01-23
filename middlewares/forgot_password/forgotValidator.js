const Joi = require("@hapi/joi");

module.exports = function forgotValidator(req, res, next){
    try{
        const {email} = req.body;
        const Schema = Joi.object({
            email: Joi.string().min(10).max(100).required().email()
        })
        const {error} = Schema.validate({email});
        if(error){
            return res.status(400).json({...error, type: "validation"});
        }
        next();
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}