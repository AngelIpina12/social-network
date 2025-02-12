const Follow = require("../models/follow");

const followUserIds = async(identityUserId) => {
    try{
        const following = await Follow.find({"user": identityUserId}).select("followed -_id");
        const followers = await Follow.find({"followed": identityUserId}).select("user -_id");
        const followingClean = following.map(follow => follow.followed);
        const followersClean = followers.map(follow => follow.user);
        return {
            following: followingClean,
            followers: followersClean
        };
    }catch(error){
        console.error("Error en followUserIds:", error);
        throw error;
    }
}

const followThisUser = async(identityUserId, profileUserId) => {
    try{
        const following = await Follow.findOne({"user": identityUserId, "followed": profileUserId});
        const follower = await Follow.findOne({"user": profileUserId, "followed": identityUserId});
        return{
            following,
            follower
        }
    }catch(error){
        return
    }
}

module.exports = {
    followUserIds,
    followThisUser
}