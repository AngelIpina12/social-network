const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("../services/jwt")

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

module.exports = {
    testUser,
    register,
    login,
    profile
}