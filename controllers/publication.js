const Publication = require("../models/publication");

const testPublication = (req, res) => {
    return res.status(200).send({
        message: "Message sended from controllers/publication.js"
    })
}

const save = async (req, res) => {
    const params = req.body;
    if(!params.text){
        return res.status(400).send({
            status: "error",
            message: "Text is required."
        })
    }
    let newPublication = new Publication(params)
    newPublication.user = req.user.id;
    try{
        const publicationStored = await newPublication.save();
        return res.status(200).json({
            status: "success",
            message: "Publication saved successfully.",
            publication: publicationStored
        })
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "An error has ocurred. " + error
        });
    }
}

module.exports = {
    testPublication,
    save
}