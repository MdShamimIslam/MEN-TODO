const jwt = require('jsonwebtoken');

const checkLogin = async(req,res,next)=>{
    const {authorization} = req.headers;
    try {
        const token = authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        const {username,userId} = decoded;
        req.username = username;
        req.userId = userId;
        next();
    } catch (error) {
        next('Authentication failure');
    }
}

module.exports = checkLogin;