const mongoose = require("mongoose");

const connection = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/social_network_official");
        console.log("Conected to MongoDB");
    }catch (error) {
        console.error("An error ocurred while connecting to MongoDB: " + error);
    }
}

module.exports = connection;