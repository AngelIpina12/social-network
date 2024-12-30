const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("../services/jwt")
const mongoosePagination = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");

const testUser = (req, res) => {
    return res.status(200).send({
        message: "Message sended from controllers/user.js",
        user: req.user
    })
}

const register = async (req, res) => {
    const params = req.body;

    if(!params.name || !params.email || !params.password || !params.nick){
        return res.status(400).json({
            status: "error",
            message: "One or more data is missing."
        })
    }
    try {
        const duplicatedUsers = await User.find({ $or: [
            {email: params.email.toLowerCase()},
            {nick: params.nick.toLowerCase()}
        ]});
        if(duplicatedUsers && duplicatedUsers.length >= 1){
            return res.status(200).json({
                status: "success",
                message: "This user is already existing."
            })
        }
        const hashedPassword = await bcrypt.hash(params.password, 10);
        params.password = hashedPassword
        let userToSave = new User(params);
        userToSave.save();
        return res.status(200).json({
            status: "success",
            message: "User registered successfully.",
            user: userToSave
        })
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "An error has occurred: " + error,
        })
    }
}

const login = async (req, res) => {
    const params = req.body;

    if(!params.email || !params.password){
        return res.status(400).json({
            status: "error",
            message: "One or more data is missing."
        })
    }
    try{
        const userLogin = await User.findOne({email: params.email});
        const comparedPassword = bcrypt.compareSync(params.password, userLogin.password)
        if(!comparedPassword){
            return res.status(400).json({
                status: "error",
                message: "You haven't entered the correct password."
            })
        }
        const token = jwt.createToken(userLogin)
        return res.status(200).json({
            status: "success",
            message: "You have logged in successfully.",
            user: {
                id: userLogin._id,
                name: userLogin.name,
                nick: userLogin.nick
            },
            token
        })
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "An error has occurred: " + error,
        })
    }
}

const profile = async (req, res) => {
    const id = req.params.id;
    try{
        const userProfile = await User.findById(id).select({password: 0, role: 0});
        return res.status(200).json({
            status: "success",
            message: "You have accessed your profile successfully.",
            user: userProfile
        })
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "An error has ocurred: " + error,
        })
    }
}

const list = async (req, res) => {
    let page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    page = parseInt(page);
    let itemsPerPage = 5;
    try{
        const users = await User.find().sort('_id').paginate(page, itemsPerPage);
        const totalItems = await User.countDocuments();
        return res.status(200).json({
            status: "success",
            message: "You have accessed the list of users successfully.",
            users,
            page,
            itemsPerPage,
            total: totalItems,
            pages: Math.ceil(totalItems/itemsPerPage)
        })
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "An error has occurred: " + error
        });
    }
}

const update = async (req, res) => {
    const userIdentity = req.user;
    const userToUpdate = req.body;
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;
    
    try {
        const duplicatedUsers = await User.find({ $or: [
            {email: userToUpdate.email.toLowerCase()},
            {nick: userToUpdate.nick.toLowerCase()}
        ]});
        let userIsSet = false;
        duplicatedUsers.forEach(user => {
            if(user && user._id != userIdentity.id) userIsSet = true;
        });
        if(userIsSet){
            return res.status(200).json({
                status: "success",
                message: "This user is already existing."
            })
        }
        if(userToUpdate.password){
            const hashedPassword = await bcrypt.hash(userToUpdate.password, 10);
            userToUpdate.password = hashedPassword
        }
        let userToUpload = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, {new: true});
        return res.status(200).json({
            status: "success",
            message: "User updated successfully.",
            user: userToUpload
        })
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "An error has occurred: " + error,
        })
    }
}

const upload = async (req, res) => {
    if(!req.file){
        return res.status(400).json({
            status: "error",
            message: "No image was uploaded."
        });
    }
    let image = req.file.originalname;
    const imageSplit = image.split("\.");
    const imageExtension = imageSplit[imageSplit.length - 1];
    if(imageExtension != "jpg" && imageExtension != "png" && imageExtension != "jpeg" && imageExtension != "gif"){
        const filePath = req.file.path;
        const fileDeleted = fs.unlinkSync(filePath);
        return res.status(400).json({
            status: "error",
            message: "The uploaded image is not a valid image.",
            fileDeleted
        })
    }
    try{
        const imageToUpload = await User.findOneAndUpdate(req.user._id, {image: req.file.filename}, {new: true});
        return res.status(200).json({
            status: "success",
            user: imageToUpload,
            file: req.file
        });
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "An error has occurred: " + error
        })
    }
}

const avatar = async (req, res) => {
    const file = req.params.file;
    const filePath = "./uploads/avatars/" + file;
    fs.stat(filePath, (error, exists) => {
        if(!exists){
            return res.status(404).json({
                status: "error",
                message: "The image does not exist."
            })
        } 
        return res.sendFile(path.resolve(filePath));
    })
}

module.exports = {
    testUser,
    register,
    login,
    profile,
    list,
    update,
    upload,
    avatar
}