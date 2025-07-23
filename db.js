const mongoose=require('mongoose');

const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const userSchema=new Schema({
    name: { type: String, required: true},
    email: { type: String, unique: true},
    password: { type: String, required: true}
});

const adminSchema=new Schema({
    name: { type: String,  required: true},
    email: { type: String, unique: true},
    password: { type: String, required: true}
});

const courseSchema=new Schema({
    Title: { type: String, required: true },
    Description: { type: String},
    VideoUrl: { type: String, required: true},
    ImageUrl: { type: String, required: true},
    Price: { type: Number, required: true},
    CreationDate: { type: Date, required: true, unqiue: true},
    AdminId: { type: Schema.Types.ObjectId, ref: 'admin-informations'}
});

const myCourses=new Schema({
    UserId: {type: Schema.Types.ObjectId, ref: 'user-informations'},
    CourseId: { type: Schema.Types.ObjectId, ref: 'course-informations'}
});

const UserInfoModel=mongoose.model('user-informations', userSchema);
const AdminInfoModel=mongoose.model('admin-informations', adminSchema);
const CourseInfoModel=mongoose.model('course-informations', courseSchema);
const PurchasedCourseInfoModel=mongoose.model('myCourse-informations', myCourses);

module.exports={
    UserInfoModel,
    AdminInfoModel,
    CourseInfoModel,
    PurchasedCourseInfoModel
};