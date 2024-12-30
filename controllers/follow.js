const Follow = require("../models/follow");
const User = require("../models/user");

const testFollow = (req, res) => {
    return res.status(200).send({
        message: "Message sended from controllers/follow.js"
    })
}

const save = async (req, res) => {
    const params = req.body;
    const identity = req.user;
    const follow = new Follow({
        user: identity.id,
        followed: params.followed
    });
    try {
        const saveUserToFollow = await follow.save();
        return res.status(200).send({
            status: "success",
            message: "save method from controllers/follow.js",
            identity: req.user,
            follow: saveUserToFollow
        })
    }catch(error){
        return res.status(500).send({
            status: "error",
            message: "An error has occurred: " + error
        });
    }
}

const unfollow = async (req, res) => {
    const userId = req.user.id;
    const followedId = req.params.id;
    try{
        const userToUnfollow = await Follow.find({
            user: userId,
            followed: followedId
        }).deleteOne()
        return res.status(200).json({
            status: "success",
            message: "unfollow method from controllers/follow.js"
        })
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "An error has occurred: " + error
        })
    }

}

module.exports = {
    testFollow,
    save,
    unfollow
}