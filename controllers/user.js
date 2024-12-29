const testUser = (req, res) => {
    return res.status(200).send({
        message: "Message sended from controllers/user.js"
    })
}

module.exports = {
    testUser
}