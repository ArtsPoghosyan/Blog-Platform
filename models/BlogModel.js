const mongoose = require("../services/mongodb.js");

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: Object,
        required: true
        // example -> {
        //     id: "187485448854",
        //     name: "Artur"
        // }
    },
    comments: {
        type: Array,
        required: true,
        default: []
        // example -> [
        //     {
        //         id: "1587848484",
        //         authorId: "187485448854" 
        //         content: "this blog is very fine",
        //         createAt: "22.01.2024t22:16"
        //         updateAt: "22.01.2024t22:20"
        //     }
        // ]
    }
}, {timestamps: true});

const BlogM = mongoose.model("blog", BlogSchema);

class BlogModel {
    static createBlog = async (data) => await BlogM.create(data);
    static readBlogByUserId = async (userId) => await BlogM.find({"author.id": userId});
    static readBlog = async (id) => await BlogM.findById(id);
    static readBlogs = async () => await BlogM.find();
    static updateBlog = async (id, data) => await BlogM.findByIdAndUpdate(id, data, {new: true});
    static deleteBlog = async (id) => await BlogM.findByIdAndDelete(id);
}

module.exports = BlogModel;