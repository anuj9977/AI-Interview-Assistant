const pdfParse = require('pdf-parse');
const { generateInterviewReport,generateResumePdf } = require('../services/ai.service');
const interviewReportModel = require('../models/interviewReport.model');


async function generateInterviewController(req, res) {
    try {
        const resumeFile = req.file;

        const resumeContent = await (new pdfParse.PDFParse(
            Uint8Array.from(req.file.buffer)
        )).getText();

        const { jobDescription, selfDescription } = req.body;

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            jobDescription,
            selfDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.userId,
            jobDescription,
            resume: resumeContent.text,
            selfDescription,

            matchScore: interviewReportByAi.matchScore,
            technicalQuestions: interviewReportByAi.technicalQuestions,
            behavioralQuestions: interviewReportByAi.behavioralQuestions,
            skillGaps: interviewReportByAi.skillGaps,
            preparationPlan: interviewReportByAi.preparationPlan,
            title: interviewReportByAi.title
        });

        // ✅ ONLY ONE RESPONSE
        return res.status(201).json({
            message: 'Interview report generated successfully',
            interviewReport
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}

async function getInterviewByIdController(req, res) {
    const { interviewId } = req.params;
    const interviewReport = await interviewReportModel.findById({ _id: interviewId, user: req.user.userId });
    if (!interviewReport) {
        return res.status(404).json({ message: 'Interview report not found' });
    }
    if (interviewReport.user.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.status(200).json({ interviewReport });
}

async function getAllInterviewsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.userId }).sort({ createdAt: -1 }).select('-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan'); // Exclude large text fields for listing
    res.status(200).json({ interviewReports });
}

async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
        _id: interviewReportId,
        user: req.user.userId
    });

    if (!interviewReport) {
        return res.status(404).json({ message: 'Interview report not found' });
    }
    const { resume, jobDescription, selfDescription } = interviewReport;
    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });
    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=resume_${interviewReportId}.pdf`
    });
    res.send(pdfBuffer);
}

module.exports = { generateInterviewController, getInterviewByIdController, getAllInterviewsController, generateResumePdfController };