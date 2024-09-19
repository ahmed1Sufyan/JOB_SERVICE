import { Request } from 'express';

export interface JobData {
    jobTitle: string; // Title of the job
    jobDescription: string; // Detailed description of the job
    companyName: string; // Name of the company posting the job
    location: {
        // Location object with city, state, country, and remote options
        city: string;
        state: string;
        country: string;
        remoteOption: string; // Can be "Remote", "On-site", "Hybrid", etc.
    };
    employmentType: string; // Full-time, Part-time, Contract, etc.
    salaryRange: {
        // Salary range object with min and max salary values
        minSalary: number;
        maxSalary: number;
        currency: string; // Currency type like "USD", "EUR", etc.
    };
    experienceLevel: string; // Entry-level, Mid-level, Senior-level, etc.
    skills: string[]; // List of required skills
    qualifications: string[]; // List of qualifications (e.g., degree, certifications)
    industry: string; // Industry category (e.g., Technology, Finance)
    jobCategory: string; // Job category (e.g., Engineering, Marketing)
    postDate: string; // Date when the job is posted (ISO 8601 date string)
    applicationDeadline: string; // Deadline for applying (ISO 8601 date string)
    applicationLink: string; // Link to the application page
    companyOverview: string; // Overview of the company
    benefits: string[]; // List of benefits (e.g., Health insurance, 401(k))
    jobFunction: string; // Job function (e.g., Software Development)
    workSchedule: string; // Work schedule (e.g., Flexible, 9-to-5)
    visaSponsorship: string; // Yes or No for visa sponsorship availability
    numOpenings: number; // Number of job openings
    reportingManager: string; // Name of the reporting manager
    userId: string; // ID of the user who posted the job
}

export interface RequestJobData extends Request {
    body: JobData;
}
export interface getJobfilter {
    title?: string;
    location?: string;
    jobType?: string;
    company?: string;
    salaryRange?: string;
    limit?: number;
    page?: number;
}

// export interface Jobdatatype {
//     id: string;
// }
// export interface JobId extends Request {
//     query: string;
// }
