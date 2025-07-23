require('dotenv').config({
    path: './keys/.env'
});

const express=require('express');

const mongoose=require('mongoose');

const {userRouter}=require('./routes/userInfo');
const {adminRouter}=require('./routes/adminInfo');

const app=express();
app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);
// app.use('api/v1/courses', myCourseRouter);

async function main(){
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(3000, ()=>{
        console.log('the server is running on port 3000');
    });
} 

main();