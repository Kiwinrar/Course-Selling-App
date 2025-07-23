require('dotenv').config({
    path: './keys/.env'
});

const jwt=require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET;

function userAuth(req, res, next){
    const uid=req.headers.auth;
    const token=jwt.verify(uid, JWT_SECRET);
    if(!token){
        res.status(403).send({message: 'Error logging in'});
    }
    req.userId=token.userId;
    console.log(token.userId)
    next();
}

module.exports={
    userAuth
}