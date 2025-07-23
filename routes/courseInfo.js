const Router=require('express');
const courseRouter=Router();
const { CourseInfoModel }=require('../db');
const { adminAuth }=require('../middleware/adminAuth');
const mongoose=require('mongoose');

courseRouter.post('/create', adminAuth, async (req, res)=>{
    try{
    const { Title, Description, VideoUrl, ImageUrl, Price}=req.body
    const AdminId=req.adminId;
    const CreationDate=new Date();
    console.log('ok')
    const response=await CourseInfoModel.create({
        Title: Title,
        Despcription: Description,
        VideoUrl: VideoUrl,
        ImageUrl: ImageUrl,
        Price: Price,
        AdminId: AdminId,
        CreationDate: CreationDate
    });
    if(!response){
        res.status(403).send({message: 'The course cannot be created', err: err});
    }
    res.status(203).send({response: response});
    }catch(err){
        res.status(403).send({message: 'Error in acessing the course'});
    }finally{
        const AdminId=req.adminId
        console.log('the course creation for admin'+AdminId+'is complete')
    }
});

courseRouter.post('/edit', adminAuth, async (req, res)=>{
    try {
        const  {Title, VideoUrl, Description, ImageUrl, Price}=req.body;
        const CourseId=String(req.body.CourseId);
        const CreationDate=new Date();
        const AdminId=req.adminId;
        const ObjectCourseId=new mongoose.Types.ObjectId(CourseId);
        console.log(ObjectCourseId)
        const response=await CourseInfoModel.updateOne({
            AdminId: AdminId,
            _id: ObjectCourseId
        }, {
            Title: Title,
            VideoUrl: VideoUrl,
            Description: Description,
            ImageUrl: ImageUrl,
            Price: Price,
            CreationDate: CreationDate    
        });
        if(!response){
            res.status(403).send({
                message: 'Error in Editing Course'
            });
        }
        res.status(200).send({
            response: response
        });
    } catch (error) {
        res.status(403).send({
            message: 'Check if all required fields for the course are present',
            err: error
        });
    }finally{
        const AdminId=req.adminId;
        console.log('the course editing of the admin with adminId'+AdminId+' is completer');
    }
});

courseRouter.post('/delete', adminAuth, async (req, res)=>{
    try {
        const CourseId=String(req.body.CourseId);
        const AdminId=req.adminId;
        const ObjectCourseId=new mongoose.Types.ObjectId(CourseId);
        console.log(ObjectCourseId)
        const response=await CourseInfoModel.deleteOne({
            AdminId: AdminId,
            _id: ObjectCourseId
        });
        if(!response){
            res.status(403).send({
                message: 'Error in Editing Course'
            });
        }
        res.status(200).send({
            response: response
        });
    } catch (error) {
        res.status(403).send({
            message: 'Check if all required fields for the course are present',
            err: error
        });
    }finally{
        const AdminId=req.adminId;
        console.log('the course deletion of the admin with adminId'+AdminId+' is complete');
    }
});

courseRouter.get('/myCourses', adminAuth, async (req, res)=>{
    try {
        const AdminId=req.adminId;
        const response=await CourseInfoModel.find({
            AdminId: AdminId
        });
        if(!response){
            res.status(403).send({
                Message: 'No courses under this admin id found'
            });
        }
        res.status(200).send({message: 'Hello '+AdminId, response: response})
    } catch (error) {
        res.status(403).send({message: 'error in fetching the courses'});
    }
});

module.exports={
    courseRouter
}