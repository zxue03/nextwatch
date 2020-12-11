const jwt = require("jsonwebtoken");

//Middleware that's used to verify user token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    if(!token){
        return res.sendStatus(401);
    }
    try {
        const userId = jwt.verify(token, "fhbeghewfevwkgbc");
        req.userId = userId;
        next();
    }
    catch(err){
        res.sendStatus(403);
    }   
}

module.exports = verifyToken;