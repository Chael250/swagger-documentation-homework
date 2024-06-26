const jwt = require("jsonwebtoken");
const config = require("config");
const debug = require("debug")

//Middleware for authorization not authenticatation
function authMiddleware(req,res,next){   
    const token = req.header("x-auth-token");
    if(!token) return res.status(401).send("No token provided...")

    try{
        const decodedPayload = jwt.verify(token,config.get("jwtPrivateKey"));
        req.user = decodedPayload;
        next()
    }
    catch(ex){
        debug("Invalid Token...")
    }
}

module.exports = authMiddleware