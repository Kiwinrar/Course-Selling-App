require('dotenv').config({
    path: './keys/.env'
});

const jwt=require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET;

function adminAuth(req, res, next){
    const uid=req.headers.auth;
    const token=jwt.verify(uid, JWT_SECRET);
    if(!token){
        res.status(403).send({message: 'Error logging in'});
    }
    req.adminId=token.adminId;
    next();
}

module.exports={
    adminAuth
}