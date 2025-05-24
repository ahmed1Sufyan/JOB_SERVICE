import { Request } from 'express';
import { Timestamp } from 'typeorm';

export interface JobData {
    jobTitle: string; // Title of the job
    jobDescription: string; // Detailed description of the job
    company: {
        name: string;
        website: string;
    }; // Name of the company posting the job
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
    jobTitle?: string;
    location?: string;
    jobCategory?: string;
    experienceLevel?: string;
    companyName?: string;
    workSchedule?: string;
    benefits?: string;
    salaryRange?: string;
    limit?: number;
    page?: number;
    employmentType?: string;
    createdAt?: Timestamp;
    skills?: string | string[];
}
export interface updateData {
    body: getJobfilter;
    params: {
        id: string;
    };
}
// export interface Jobdatatype {
//     id: string;
// }
// export interface JobId extends Request {
//     query: string;
// }
export interface prompt extends Request {
    body: {
        title: string;
        companyName: string;
        experience: string;
        soft_skills: string;
        role: string;
        qualification: string;
    };
}

// {
//     //   "title": "React js is an js frontend to handle the frontend ui",
//     "title" : "Make an interview like scenario start asking questions one by one for beginner react js developer to me,i will answer that what you ask if i dont know the answer give a postive reply and feedback and move on to the next question and repeat this process until you will have asked 10 questions about that topic now start!",
//     "companyName": "Avanza Solutions",
//     "experience": "5+ years of experience in software development",
//     "soft_skills": "Strong communication,Teamwork,Problem-solving,Adaptability",
//     "role": "Senior React Js developer",
//     "qualification":
//       "Bachelor's degree in Cs or related fields"
// }
