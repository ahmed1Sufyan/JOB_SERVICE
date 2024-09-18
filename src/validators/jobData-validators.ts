/* eslint-disable @typescript-eslint/no-unsafe-call */
import { checkSchema } from 'express-validator';

export const jobDataValidation = checkSchema({
    jobTitle: {
        errorMessage:
            'Job Title is required and must be between 5 and 100 characters',
        notEmpty: true,
        trim: true,
        isLength: {
            options: { min: 5, max: 100 },
        },
    },
    jobDescription: {
        errorMessage:
            'Job Description is required and must be at least 50 characters long',
        notEmpty: true,
        trim: true,
        isLength: {
            options: { min: 50 },
        },
    },
    companyName: {
        errorMessage:
            'Company Name is required and must be between 3 and 100 characters',
        notEmpty: true,
        trim: true,
        isLength: {
            options: { min: 3, max: 100 },
        },
    },
    // location: {
    //     city: {
    //         errorMessage: 'City is required',
    //         notEmpty: true,
    //         trim: true,

    //     },
    //     state: {
    //         errorMessage: 'State is required',
    //         notEmpty: true,
    //         trim: true,
    //     },
    //     country: {
    //         errorMessage: 'Country is required',
    //         notEmpty: true,
    //         trim: true,
    //     },
    //     remoteOption: {
    //         errorMessage:
    //             'Remote Option is required and must be one of "Remote", "On-site", or "Hybrid"',
    //         notEmpty: true,
    //         trim: true,
    //         isIn: {
    //             options: ['Remote', 'On-site', 'Hybrid'],
    //         },
    //     },
    // },
    employmentType: {
        errorMessage:
            'Employment Type is required and must be one of "Full-time", "Part-time", or "Contract"',
        notEmpty: true,
        trim: true,
        isIn: {
            options: ['Full-time', 'Part-time', 'Contract'],
        },
    },
    // salaryRange: {
    //     minSalary: {
    //         errorMessage: 'Minimum Salary is required and must be a number',
    //         notEmpty: true,
    //         isNumeric: true,
    //         toFloat: true,
    //     },
    //     maxSalary: {
    //         errorMessage: 'Maximum Salary is required and must be a number',
    //         notEmpty: true,
    //         isNumeric: true,
    //         toFloat: true,
    //     },
    //     currency: {
    //         errorMessage:
    //             'Currency is required and must be a valid currency code (e.g., "USD")',
    //         notEmpty: true,
    //         trim: true,
    //         isLength: {
    //             options: { min: 3, max: 3 },
    //         },
    //     },
    // },
    experienceLevel: {
        errorMessage:
            'Experience Level is required and must be one of "Entry-level", "Mid-level", or "Senior-level"',
        notEmpty: true,
        trim: true,
        isIn: {
            options: [['Entry-level', 'Mid-level', 'Senior-level']],
            errorMessage:
                'Experience Level must be one of "Entry-level", "Mid-level", or "Senior-level"',
        },
    },
    skills: {
        errorMessage: 'Skills are required and must be an array of strings',
        isArray: true,
        notEmpty: true,
        custom: {
            options: (value: string[]) =>
                value.every(
                    (skill) => typeof skill === 'string' && skill.trim() !== '',
                ),
        },
    },
    qualifications: {
        errorMessage:
            'Qualifications are required and must be an array of strings',
        isArray: true,
        notEmpty: true,
        custom: {
            options: (value: string[]) =>
                value.every(
                    (qualification) =>
                        typeof qualification === 'string' &&
                        qualification.trim() !== '',
                ),
        },
    },
    industry: {
        errorMessage: 'Industry is required and must be a non-empty string',
        notEmpty: true,
        trim: true,
    },
    jobCategory: {
        errorMessage: 'Job Category is required and must be a non-empty string',
        notEmpty: true,
        trim: true,
    },
    postDate: {
        errorMessage: 'Post Date is required and must be a valid date',
        notEmpty: true,
        isISO8601: true,
    },
    applicationDeadline: {
        errorMessage:
            'Application Deadline is required and must be a valid future date',
        notEmpty: true,
        isISO8601: true,
        custom: {
            options: (value: Date) => new Date(value) > new Date(), // Ensure future date
        },
    },
    applicationLink: {
        errorMessage: 'Application Link is required and must be a valid URL',
        notEmpty: true,
        isURL: true,
    },
    companyOverview: {
        errorMessage:
            'Company Overview is required and must be a non-empty string',
        notEmpty: true,
        trim: true,
    },
    benefits: {
        errorMessage: 'Benefits are required and must be an array of strings',
        isArray: true,
        notEmpty: true,
        custom: {
            options: (value: string[]) =>
                value.every(
                    (benefit) =>
                        typeof benefit === 'string' && benefit.trim() !== '',
                ),
        },
    },
    jobFunction: {
        errorMessage: 'Job Function is required and must be a non-empty string',
        notEmpty: true,
        trim: true,
    },
    workSchedule: {
        errorMessage:
            'Work Schedule is required and must be one of "Flexible", "9-to-5", or other predefined options',
        notEmpty: true,
        trim: true,
    },
    visaSponsorship: {
        errorMessage:
            'Visa Sponsorship is required and must be one of "Yes" or "No"',
        notEmpty: true,
        trim: true,
        isIn: {
            options: [['Yes', 'No']],
            errorMessage: 'Visa Sponsorship must be either "Yes" or "No"',
        },
    },
    numOpenings: {
        errorMessage:
            'Number of Openings is required and must be a positive integer',
        notEmpty: true,
        isInt: true,
        toInt: true,
        custom: {
            options: (value: number) => value > 0,
        },
    },
    reportingManager: {
        errorMessage:
            'Reporting Manager is required and must be a non-empty string',
        notEmpty: true,
        trim: true,
    },
});
