const User = require("../models/user")
const bcrypt = require("bcrypt")

const testUser = (req, res) => {
    return res.status(200).send({
        message: "Message sended from controllers/user.js"
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
            message: "An error occurred: " + error,
            userToSave
        })
    }
}

module.exports = {
    testUser,
    register
}