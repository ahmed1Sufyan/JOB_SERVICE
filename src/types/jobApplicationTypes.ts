import { Request } from 'express';

export interface JobApplication {
    applicationId?: string | number; // Unique identifier for the application
    applicantId: string; // Unique identifier for the applicant
    jobId: string; // Unique identifier for the job being applied for
    applicationDate: Date; // Date when the application was submitted
    status?: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected'; // Current status of the application
    resume?: string; // URL or path to the applicant's resume
    coverLetter?: string; // Optional cover letter
    interviewDate?: Date; // Optional date for scheduled interview
    feedback?: string; // Optional feedback from the recruiter or interviewer
    skills?: string[];
    experienceLevel?: string;
}
export interface jobApplicationData extends Request {
    body: JobApplication;
}
