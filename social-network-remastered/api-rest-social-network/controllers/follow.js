const Follow = require("../models/follow");
const User = require("../models/user");
const mongoosePaginate = require("mongoose-paginate-v2")
const followService = require("../services/followService")

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
            message: "The user was unfollowed correctly."
        })
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "An error has occurred: " + error
        })
    }
}

const following = async (req, res) => {
    const userId = req.params.id || req.user.id;
    const page = req.params.page || 1;
    const itemsPerPage = 5;
    try {
        const options = {
            page,
            limit: itemsPerPage,
            populate: [
                { path: "user", select: "-password -role -__v -email" },
                { path: "followed", select: "-password -role -__v -email" }
              ]
        };
        const follows = await Follow.paginate({ user: userId }, options);
        const followUserIds = await followService.followUserIds(userId)
        return res.status(200).json({
            status: "success",
            message: "List of users that the user is following",
            follows: follows.docs,
            total: follows.totalDocs,
            pages: follows.totalPages,
            user_following: followUserIds.following,
            user_follow_me: followUserIds.followers
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "An error has occurred: " + error
        });
    }
}

const followers = async (req, res) => {
    let userId = req.params.id || req.user.id;
    let page = req.params.page || 1;
    const itemsPerPage = 5;
    try {
        const options = {
            page,
            limit: itemsPerPage,
            populate: { path: "user", select: "-password -role -__v -email" }
        };
        const follows = await Follow.paginate({ followed: userId }, options);
        const followUserIds = await followService.followUserIds(userId)
        return res.status(200).send({
            status: "success",
            message: "List of users that are following the user",
            follows: follows.docs,
            total: follows.totalDocs,
            pages: follows.totalPages,
            user_following: followUserIds.following,
            user_follow_me: followUserIds.followers
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "An error has occurred: " + error
        });
    }
}

module.exports = {
    testFollow,
    save,
    unfollow,
    following,
    followers
}