const jwt = require("jwt-simple");
const moment = require("moment");

const libjwt = require("../services/jwt");
const secret = libjwt.secret;

exports.auth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({
            status: "error",
            message: "The request does not have the header of authorization"
        });
    }
    let token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        let payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(400).json({
                status: "error",
                message: "Token expired"
            })
        }
        req.user = payload;
        next();
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "An error has ocurred: " + error
        })
    }
}