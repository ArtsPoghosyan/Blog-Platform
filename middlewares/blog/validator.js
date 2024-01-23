const Joi = require("@hapi/joi");

async function createValidator(data, req, res, next){
    try{
        const {title, body, authorName} = req.body;
        const Schema = Joi.object({
            title: Joi.string().min(6).max(25).required(),
            body: Joi.string().min(20).max(1000).required(),
            authorName: Joi.string().min(3).max(10).required()
        });
        const {error} = Schema.validate({title, body, authorName});
        if(error){
            return res.status(400).json({...error, type: "validation"});
        }
        next(data);
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}
async function updateValidator(data, req, res, next){
    try{
        const {title, body, blogId} = req.body;
        const Schema = Joi.object({
            blogId: Joi.string().required(),
            title: Joi.string().min(6).max(25),
            body: Joi.string().min(20).max(1000)
        });
        const {error} = Schema.validate({title, body, blogId});
        if(error){
            return res.status(400).json({...error, type: "validation"});
        }
        next(data);
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}


module.exports = { createValidator, updateValidator };