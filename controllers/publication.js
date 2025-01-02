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

const detail = async (req, res) => {
    const publicationId = req.params.id;
    try{
        const publicationStored = await Publication.findById(publicationId);
        return res.status(200).json({
            status: "success",
            message: "Detail publication.",
            publication: publicationStored
        })
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "An error has ocurred. " + error
        })
    }
}

const remove = async (req, res) => {
    const publicationId = req.params.id;
    try{
        const publicationDeleted = await Publication.find({"user": req.user.id}).deleteOne({"_id": publicationId});
        if(publicationDeleted.deletedCount == 0){
            return res.status(404).json({
                status: "error",
                message: "Not publication found."
            })
        }
        return res.status(200).json({
            status: "success",
            message: "Publication removed successfully.",
            publication: publicationDeleted
        })
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "An error has ocurred. " + error
        })
    }

}

module.exports = {
    testPublication,
    save,
    detail,
    remove
}