const Router=require('express');
const userRouter=Router();
const {z}=require('zod');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require('dotenv').config({
    path: './keys/.env'
});
const {UserInfoModel}=require('../db');
const {myCourseRouter}=require('./mycourseinfo');

userRouter.post('/signup', async(req, res)=>{
    try {
    const { name, email, password }=req.body;
    const validate=z.object({
        name: z.string().min(8, {message: 'the username must be of atleast 8 letters'}),
        email: z.string().min(1, {message: 'this is a required field'}).email(),
        password: z.string().min(8, {message: 'the password must contain atleast 8 characters'})
    });
    await validate.parseAsync({name, email, password});
    const hashPassword=await bcrypt.hash(password, 10);
    const response=await UserInfoModel.create({
        name: name,
        email: email,
        password: hashPassword
    });
    if(!response){
        res.status(403).send({
            message: 'Cannot create entry in the database'
        });
    }
    res.status(200).send({
        response: response
    });
    } catch (error) {
        console.log(error)
        if(error.errors && Array.isArray(error.errors)){
            const messages=error.errors.map(err=>err.message);
            res.status(403).send({
                message: 'Validation Error',
                Error: messages
            });
        }
        res.status(403).send({
            message: 'Check all the required fields are present'
        });
    }finally{
        const name=req.body;
        console.log('the signup of the user '+name+' is complete');
    }
});

userRouter.post('/signin', async(req, res)=>{
    try {
    const { email, password }=req.body;
    const response=await UserInfoModel.findOne({
        email: email
    });
    if(!response){
        res.status(403).send({
            message: 'No such user found'
        });
    }
    const hashPassword=bcrypt.compare(password, response.password);
    if(!hashPassword){
        res.status(403).send({message: 'the password is incorrect'});
    }
    const token=jwt.sign({
        userId: String(response._id)
    }, process.env.JWT_SECRET);
    res.status(200).send({
        message: 'signed in successfullly '+response.name,
        token: token
    });
    } catch (error) {
        res.status(403).send({
            err: err
        });
    }finally{
        const name=req.body.name;
        console.log('the signin of the user '+name+' is complete');
    }
});


userRouter.use('/courses', myCourseRouter);

module.exports={
    userRouter
}