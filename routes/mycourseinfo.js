const Router=require('express');
const myCourseRouter=Router();
const {PurchasedCourseInfoModel, CourseInfoModel}=require('../db');
const { userAuth }=require('../middleware/userAuth');
const mongoose=require('mongoose') 

myCourseRouter.post('/buy', userAuth, async(req, res)=>{
    try {
    const courseId =new mongoose.Types.ObjectId(String(req.body.courseId));
    const userId=new mongoose.Types.ObjectId(String(req.userId));
    const createdDocument = await PurchasedCourseInfoModel.create({
        CourseId: courseId,
        UserId: userId
    });
    const response = await PurchasedCourseInfoModel.findById(createdDocument._id).populate('CourseId').exec();
    if(!response){
        res.status(403).send({
            message: 'Error in buying the course of courseId'+courseId
        });
    }
    res.status(200).send({
        message: 'course purchased successfully',
        response: response
    });
    } catch (error) {
        res.status(403).send({
            message: 'Check the required inputs',
            err: error
        })   
    }finally{
        const { courseId }=req.body;
        const userId=req.userId;
        console.log('the purchasing of the course with courseId:'+courseId+' for the user with userId:'+userId+' is complete');
    }
});


myCourseRouter.get('/purchased', userAuth, async(req, res)=>{
    try {
    const userId=new mongoose.Types.ObjectId(String(req.userId));
    const response=await PurchasedCourseInfoModel.find({
        UserId: userId
    }).populate('CourseId').exec();
    if(!response){
        res.status(403).send({
            message: 'There arent any courses purchased'
        });
    }
    res.status(200).send({
        Purchased_Courses: response
    });

    } catch (error) {
        res.status(403).send({
            message: 'Check the required fields',
            err: error
        });
    }finally{
        const { courseId }=req.body;
        const userId=req.userId;
        console.log('the purchasing of the course with courseId:'+courseId+' for the user with userId:'+userId+' is complete');
    }
});

module.exports={
    myCourseRouter
}