const express =require('express');
const {authUser}=require('../middlewares/auth.middleware');
const interviewController=require('../controllers/interview.controller');
const upload=require('../middlewares/file.middleware');
const interviewRouter=express.Router();

// Define your interview routes here

/**
 * @route POST /api/interview/
 * @desc Create a new interview report on the basis of user self desc,reusme pdf and job description
 * @access Private
 * @body {jobDescription:String,resumeText:String,selfDescription:String}
 * @response {matchScore:Number,technicalQuestions:[{question:String,intention:String,answer:String}],behavioralQuestions:[{question:String,intention:String,answer:String}],skillGaps:[{skill:String,severity:Number}]}
 */
interviewRouter.post('/',authUser,upload.single("resume"),interviewController.generateInterviewController);

/**
 * @route GET /api/interview/report/:interviewId
 * @desc Get interview report by ID
 * @access Private
 * @response {matchScore:Number,technicalQuestions:[{question:String,intention:String,answer:String}],behavioralQuestions:[{question:String,intention:String,answer:String}],skillGaps:[{skill:String,severity:Number}]}
 * 
 */
interviewRouter.get('/report/:interviewId',authUser,interviewController.getInterviewByIdController);
 
/**
 * @route GET /api/interview/
 * @desc Get all interview reports of the user
 * @access Private
 * @response [{matchScore:Number,technicalQuestions:[{question:String,intention:String,answer:String}],behavioralQuestions:[{question:String,intention:String,answer:String}],skillGaps:[{skill:String,severity:Number}]}]
 */
interviewRouter.get('/',authUser,interviewController.getAllInterviewsController);

interviewRouter.post('/resume/pdf/:interviewReportId',authUser,interviewController.generateResumePdfController);

module.exports=interviewRouter;