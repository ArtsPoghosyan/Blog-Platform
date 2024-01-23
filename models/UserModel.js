const mongoose = require("../services/mongodb.js");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean, 
        default: false,
        required: true
    },
    activateKey: {
        type: String,
        required: true
    },
    auth: {
        type: Object,
        default: {}
    }
}, {timestamps: true});

const UserM = mongoose.model("user", UserSchema);

class UserModel {
    static getUserByEmail = async (email) => await UserM.findOne({email});
    static getUserById = async (id) => await UserM.findById(id);
    static createUser = async (state) => await UserM.create({...state});
    static updateUser = async (id, data) => await UserM.findByIdAndUpdate(id, data, {new:true})
    static removeUser = async (id) => await UserM.findByIdAndDelete(id);
    static confirmUser = async (id) => await UserM.findByIdAndUpdate(id, {isActive: true});
    static loginSucces = async (id, state) => await UserM.findByIdAndUpdate(id, {auth: state});
    static changePassword = async(id, password) =>  await UserM.findByIdAndUpdate(id, {password}, {new: true});
}

module.exports = UserModel;