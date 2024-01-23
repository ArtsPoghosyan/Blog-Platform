const BlogModel = require("../models/BlogModel");

class UserController{
    static createBlog = async ({userId}, req, res, next)=>{
        try{
            const {title, body, authorName} = req.body;
            const blog = { title, body, comments: [],
                author: {
                    id: userId,
                    name: authorName
                }
            };
            const newBlog = await BlogModel.createBlog(blog);
            return res.status(200).json({message: "create blog is succesfully", blog: newBlog});
        }catch(err){
            return next(err);
        }
    }
    static readBlog = async (req, res, next)=>{
        try{
            const {blog, blogId, userId} = req.query;
            if(blog === "all"){
                const blogs = await BlogModel.readBlogs();
                return res.status(200).json({message: "read blogs is succesfully", blogs});
            }
            if(blogId){
                const blog = await BlogModel.readBlog(blogId);
                return res.status(200).json({message: "read blog by blogId is succesfully", blog: blog || []});
            }
            if(userId){
                const blogs = await BlogModel.readBlogByUserId(userId);
                return res.status(200).json({message: "read blog by userId is succesfully", blogs});
            }

            return res.status(400).json({message: "read blog is failed because OR (not passed blog or blogId or userId) OR (are wrong)"});
        }catch(err){
            return next(err);
        }
    }
    static updateBlog = async ({userId}, req, res, next)=>{
        try{
            const {title, body, blogId} = req.body;
            const blog = {};
            if(title){ blog.title = title; }
            if(body){ blog.body = body; }

            const oldBlog = await BlogModel.readBlog(blogId);
            if(oldBlog.author.id !== userId){
                return res.status(405).json({message: "not permission on this user update this blog because he isn't owner this blog's"});
            }

            const newBlog = await BlogModel.updateBlog(blogId, blog);
            return res.status(200).json({message: "update blog is succesfully", blog: newBlog});
        }catch(err){
            return next(err);
        }
    }
    static deleteBlog = async ({userId}, req, res, next)=>{
        try{
            const {blogId} = req.body;
            if(!blogId){
                return res.status(400).json({message: "not passed blogId"});
            }

            const blog = await BlogModel.readBlog(blogId);
            if(blog.author.id !== userId){
                return res.status(405).json({message: "not permission on this user delete this blog because he isn't owner this blog's"});
            }

            await BlogModel.deleteBlog(blogId);
            return res.status(200).json({message: "delete blog is succesfully"});
        }catch(err){
            return next(err);
        }
    }
}

module.exports = UserController;