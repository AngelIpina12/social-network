const Publication = require("../models/publication");
const fs = require("fs");
const path = require("path");
const followService = require("../services/followService");

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
    page = parseInt(page);
    const itemsPerPage = 5;
    try{
        const options = {
            page,
            limit: itemsPerPage,
            populate: { path: "user", select: "-password -role -__v -email" },
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

const upload = async (req, res) => {
    const publicationId = req.params.id;
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
        const publicationUpdated = await Publication.findOneAndUpdate({"user": req.user.id, "_id": publicationId}, {file: req.file.filename}, {new: true});
        return res.status(200).json({
            status: "success",
            publication: publicationUpdated,
            file: req.file
        });
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "An error has occurred: " + error
        })
    }
}

const media = async (req, res) => {
    const file = req.params.file;
    const filePath = "./uploads/publications/" + file;
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

const feed = async (req, res) => {
    let page = 1
    if(req.params.page) page = req.params.page
    page = parseInt(page);
    let itemsPerPage = 5
    try{
        const options = {
            page,
            limit: itemsPerPage,
            populate: { path: "user", select: "-password -role -__v -email" },
            sort: { created_at: -1 }
        };
        const myFollows = await followService.followUserIds(req.user.id);
        const publications = await Publication.paginate({user: {$in: myFollows.following}}, options);
        return res.status(200).json({
            status: "success",
            message: "This is the feed page.",
            following: myFollows.following,
            total: publications.totalDocs,
            page: publications.page,
            pages: publications.totalPages,
            publications: publications.docs,
        })
    }catch(error){
        return res.status(500).json({
            status: "error",
            message: "An error has occurred: " + error
        })
    }

    
}

module.exports = {
    testPublication,
    save,
    detail,
    remove,
    user,
    upload,
    media,
    feed
}