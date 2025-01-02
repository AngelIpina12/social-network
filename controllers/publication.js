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

const user = async (req, res) => {
    const userId = req.params.id;
    let page = 1;
    if(req.params.page) page = req.params.page;
    const itemsPerPage = 5;
    try{
        const options = {
            page,
            limit: itemsPerPage,
            populate: { path: "user", select: "-password -role -__v" },
            sort: { created_at: -1 }
        };
        const userPublications = await Publication.paginate({"user": userId}, options);
        if(userPublications.docs.length == 0){
            return res.status(404).json({
                status: "error",
                message: "No publications found."
            })
        }
        return res.status(200).json({
            status: "success",
            message: "User publications.",
            publications: userPublications,
            page,
            total: userPublications.totalDocs,
            totalPages: userPublications.totalPages
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
    remove,
    user
}