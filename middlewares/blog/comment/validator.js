const Joi = require("@hapi/joi");

async function createValidator(data, req, res, next){
    try{
        const {content, blogId} = req.body;
        const Schema = Joi.object({
            content: Joi.string().min(6).max(500).required(),
            blogId: Joi.string().required()
        });
        const {error} = Schema.validate({content, blogId});
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
        const {content, blogId, commentId} = req.body;
        const Schema = Joi.object({
            content: Joi.string().min(6).max(500).required(),
            blogId: Joi.string().required(),
            commentId: Joi.string().required()
        });
        const {error} = Schema.validate({content, blogId, commentId});
        if(error){
            return res.status(400).json({...error, type: "validation"});
        }
        next(data);
    }catch(err){
        return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
    }
}

module.exports = { createValidator, updateValidator };