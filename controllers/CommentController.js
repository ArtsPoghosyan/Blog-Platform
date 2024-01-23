const BlogModel = require("../models/BlogModel");

class UserController{
    static addComment = async ({userId}, req, res, next)=>{
        try{
            const {content, blogId} = req.body;
            const comment = { 
                id: Date.now(),
                authorId: userId,
                content, 
                createdAt: new Date().toISOString()
            };
            const blog = await BlogModel.updateBlog(blogId, {$push: {"comments": comment}});
            return res.status(200).json({message: "add comment is succesfully", blog});
        }catch(err){
            return next(err);
        }
    }
    static updateComment = async ({userId}, req, res, next)=>{
        try{
            const {content, commentId, blogId} = req.body;

            const oldBlog = await BlogModel.readBlog(blogId);
            let index;
            if(oldBlog.comments.filter((evt, i) => {
                if(evt.authorId == userId && evt.id == commentId){
                    index = i;
                    return evt;
                }}).length === 0){
                return res.status(404).json({message: "not found comment"});
            }
            oldBlog.comments[index] = {
                ...oldBlog.comments[index],
                content,
                updatedAt: new Date().toISOString()
            }
            const newBlog = await BlogModel.updateBlog(blogId, {comments: oldBlog.comments});
            return res.status(200).json({message: "update comment is succesfully", blog: newBlog});
        }catch(err){
            return next(err);
        }
    }
    static deleteComment = async ({userId}, req, res, next)=>{
        try{
            const {blogId, commentId} = req.body;
            if(!blogId || !commentId){
                return res.status(400).json({message: "not passed blogId or commentId"});
            }

            const blog = await BlogModel.readBlog(blogId);
            blog.comments = blog.comments.filter((evt)=> evt.authorId !== userId && evt.id !== commentId);

            const newBlog = await BlogModel.updateBlog(blogId, {comments: blog.comments});
            return res.status(200).json({message: "delete comment is succesfully", blog: newBlog});
        }catch(err){
            return next(err);
        }
    }
}

module.exports = UserController;