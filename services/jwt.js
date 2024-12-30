const jwt = require("jwt-simple");
const moment = require("moment");

const secret = "CLAVE_ULTRAsecreta_PaRa_eL_proyecto_De_lA_RED_social";

const createToken = (user) => {
    const payload = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    }
    return jwt.encode(payload, secret);
}

module.exports = {
    secret,
    createToken
}