const {z}=require('zod');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const {Router}=require('express');
const adminRouter=Router();
const {AdminInfoModel}=require('../db');
const {courseRouter}=require('./courseInfo');
require('dotenv').config({
    path: './keys/.env'
});

adminRouter.post('/signup', async (req, res)=>{
    try{
        const { name, email, password }=req.body;
        const validate=z.object({
            name: z.string().min(8, {message: 'the username must be min of 8 characters'}),
            email: z.string().min(1, {message: 'the email is a required feild'}).email({message: 'the email should be valid'}),
            password: z.string().min(10, {message: 'the password should have minimum of 8 characters'})
        });
        await validate.parseAsync({name, email, password});
        const hash=await bcrypt.hash(password, 10);
        const response=await AdminInfoModel.create({
            name: name,
            email: email,
            password: hash
        });
        if(!response){
            res.status(403).send({
                message: 'error in adding entries in the db'
            });
        }
        res.status(200).send({
            message: response
        });
    }
    catch(err){
        console.log(err);
        if(err.errors && Array.isArray(err.errors)){
            const messages=err.errors.map(e=> e.message);
            res.status(403).send({
                message: 'Validation Error',
                error: messages
            })
        }
        res.status(403).send({
            message: 'error signing up',
            error: err
        });
    }
    finally{
        console.log('the signup of the user is complete')
    }
});


adminRouter.post('/signin', async (req, res)=>{
    try{
    const { email, password }=req.body;
    const response=await AdminInfoModel.findOne({
        email: email
    });
    if(!response){
        res.status(403).send({message: 'Error signing in the user'}); 
    }
    const hashPassword=await bcrypt.compare(password, response.password) 
    if(!hashPassword){
        res.status(403).send({errmsg: 'the given password does not match the database password'});
    }
    const token=jwt.sign({
        adminId: response._id.toString() 
    }, process.env.JWT_SECRET);
    res.status(203).send({token: token});
    }
    catch(err){
        res.status(203).send({err: err});
    }
    finally{
        const name=req.body
        console.log('the signin endpoint of the user'+name+'is complete');
    }
});

adminRouter.use('/course', courseRouter);

module.exports={
    adminRouter
}