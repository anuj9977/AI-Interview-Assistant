const mongoose = require('mongoose');
const { string } = require('zod');

/**
 * -job desctiption schema:String
 * -resume text:String
 * -Self description text:String
 * 
 * -match score:Number
 * 
 * 
 * -Technical questions :
 *     [{
 *       question:" ",
 *      intention:Number:" "
 *      answer:" ",
 * }]
 * -Bhevioral questions :
 *     [{
 *       question:" ",
 *      intention:Number:" "
 *      answer:" ",
 * }]
 * 
 * -skill gaps :[{
 *      skill:" ",
 *      severity:{
 *     type:Number,
 *    enum:[1,2,3] // 1 for low, 2 for medium, 3 for high
 * }]
 * 
 * preparation plan :[{}]
 * 
 */

const technicalQuestionSchema=new mongoose.Schema({
    question:{
        type:String,
        required:[true,'Technical question is required']
    },
    intention:{
        type:String,
        required:[true,'Intention is required']
    },
    answer:{    
        type:String,
        required:[true,'Answer is required']
    }
},{
    _id: false
});
const behavioralQuestionSchema=new mongoose.Schema({
    question:{
        type:String,
        required:[true,'Technical question is required']
    },
    intention:{
        type:String,
        required:[true,'Intention is required']
    },
    answer:{    
        type:String,
        required:[true,'Answer is required']
    }
},{
    _id: false
});

const skillGapSchema=new mongoose.Schema({
    skill:{
        type:String,
        required:[true,'Skill is required']
    },
    severity:{
        type:String,
        enum:['low','medium','high'],
        required:[true,'Severity is required']
    }
},{
    _id: false
});


const preparationPlanSchema=new mongoose.Schema({
    day:{
        type:String,
        required:[true,'Day is required']
    },
    focus:{
        type:String,
        required:[true,'Focus is required']
    },
    tasks:[{
        type:String,
        required:[true,'Task is required']}]
});

    


const interviewReportSchema=new mongoose.Schema({
    jobDescription:{
        type:String,
        required:[true,'Job description is required']

    },
    resume:{
        type:String,

    },
    selfDescription:{
        type:String,

    },
    matchScore:{
        type:Number,
        min:0,
        max:100,
        required:[true,'Match score is required']
    },
   technicalQuestions: [technicalQuestionSchema], 
    
    // ✅ FIX: Inhe bhi Array banaiye
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps:[skillGapSchema],
    preparationPlan:[preparationPlanSchema],
    title:{
        type:String,
        required:[true,'Title is required']
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
    }
},{
    timestamps:true 
});

const interviewReportModel=mongoose.model('InterviewReport',interviewReportSchema);

module.exports=interviewReportModel;