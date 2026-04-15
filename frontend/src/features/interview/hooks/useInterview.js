import { getAllInterviewReports,getInterviewReportById,generateInterviewReport } from "../services/interview.api";
import { useContext } from "react";
import { InterviewContext } from "../interview.context.jsx";


export const useInterview = () => {
    const context = useContext(InterviewContext);
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }
    const { loading, setLoading, report, setReport, reports, setReports } = context;

    const generateReport = async ({jobDescription,selfDescription,resumeFile}) => {
        setLoading(true);
        let data=null;
        try {
             data = await generateInterviewReport({jobDescription,selfDescription,resumeFile});
            setReport(data.interviewReport);
        }
        catch (error) {
            console.error("Error generating interview report:", error);
        }finally {
            setLoading(false);
        }
        return data?.interviewReport;
    }

    const getReportById = async (interviewId) => {
        setLoading(true);
        let data=null;
        try {
             data = await getInterviewReportById(interviewId);
            setReport(data.interviewReport);
        }
        catch (error) {
            console.error("Error fetching interview report:", error);
        }
        finally {
            setLoading(false);
        }
        return data?.interviewReport;
        }
    const getAllReports = async () => {
        setLoading(true);
        let data=null;
        try {
             data = await getAllInterviewReports();
            setReports(data.interviewReports);
        }
        catch (error) {
            console.error("Error fetching interview reports:", error);
        }
        finally {
            setLoading(false);
        }
        return data?.interviewReports;
    }
    return { loading, report, reports, generateReport, getReportById, getAllReports };
}

