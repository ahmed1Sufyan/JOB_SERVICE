/* eslint-disable @typescript-eslint/no-unsafe-call */
import { checkSchema } from 'express-validator';

export const jobDataValidation = checkSchema({
    jobTitle: {
        errorMessage:
            'Job Title is required and must be between 5 and 100 characters',
        notEmpty: {
            errorMessage: 'Job Title is required',
        },
        trim: true,
        isLength: {
            options: { min: 5, max: 100 },
            errorMessage: 'Job Title must be between 5 and 100 characters',
        },
    },
    jobDescription: {
        errorMessage:
            'Job Description is required and must be at least 50 characters long',
        notEmpty: {
            errorMessage: 'Job Description is required',
        },
        trim: true,
        isLength: {
            options: { min: 50 },
            errorMessage: 'Job Description must be at least 50 characters long',
        },
    },
    company: {
        errorMessage:
            'Company information is required and must include name and website',
        notEmpty: {
            errorMessage: 'Company information is required',
        },
        custom: {
            options: (value: Record<string, string>) => {
                return (
                    typeof value === 'object' &&
                    typeof value.name === 'string' &&
                    value.name.trim().length >= 3 &&
                    value.name.trim().length <= 100 &&
                    typeof value.website === 'string' &&
                    value.website.trim() !== ''
                );
            },
            errorMessage:
                'Company must have a valid name (3-100 characters) and website',
        },
    },
    jobType: {
        errorMessage:
            'Job Type is required and must be one of "Full-time", "Part-time", "Contract", "Internship", or "Temporary"',
        notEmpty: {
            errorMessage: 'Job Type is required',
        },
        trim: true,
        isIn: {
            options: [
                [
                    'Full-time',
                    'Part-time',
                    'Contract',
                    'Internship',
                    'Temporary',
                ],
            ],
            errorMessage:
                'Job Type must be one of "Full-time", "Part-time", "Contract", "Internship", or "Temporary"',
        },
    },
    experienceLevel: {
        errorMessage:
            'Experience Level is required and must be one of "Entry-level", "Mid-level", or "Senior-level"',
        notEmpty: {
            errorMessage: 'Experience Level is required',
        },
        trim: true,
        isIn: {
            options: [['Entry-level', 'Mid-level', 'Senior-level']],
            errorMessage:
                'Experience Level must be one of "Entry-level", "Mid-level", or "Senior-level"',
        },
    },
    skills: {
        errorMessage: 'Skills are required and must be an array of strings',
        isArray: {
            errorMessage: 'Skills must be an array',
        },
        notEmpty: {
            errorMessage: 'Skills are required',
        },
        custom: {
            options: (value: string[]) =>
                value.every(
                    (skill) => typeof skill === 'string' && skill.trim() !== '',
                ),
            errorMessage: 'Each skill must be a non-empty string',
        },
    },
    qualifications: {
        errorMessage:
            'Qualifications are required and must be an array of strings',
        isArray: {
            errorMessage: 'Qualifications must be an array',
        },
        notEmpty: {
            errorMessage: 'Qualifications are required',
        },
        custom: {
            options: (value: string[]) =>
                value.every(
                    (qualification) =>
                        typeof qualification === 'string' &&
                        qualification.trim() !== '',
                ),
            errorMessage: 'Each qualification must be a non-empty string',
        },
    },
    industry: {
        errorMessage: 'Industry is required and must be a non-empty string',
        notEmpty: {
            errorMessage: 'Industry is required',
        },
        trim: true,
    },
    jobCategory: {
        errorMessage: 'Job Category is required and must be a non-empty string',
        notEmpty: {
            errorMessage: 'Job Category is required',
        },
        trim: true,
    },
    // postDate: {
    //     errorMessage: 'Post Date must be a valid ISO8601 date or null',
    //     optional: true,
    //     isISO8601: {
    //         errorMessage: 'Post Date must be a valid ISO8601 date',
    //     },
    // },
    // applicationDeadline: {
    //     errorMessage:
    //         'Application Deadline is required and must be a valid future date',
    //     notEmpty: {
    //         errorMessage: 'Application Deadline is required',
    //     },
    //     isISO8601: {
    //         errorMessage: 'Application Deadline must be a valid ISO8601 date',
    //     },
    //     custom: {
    //         options: (value: Date) => new Date(value) > new Date(), // Ensure future date
    //         errorMessage: 'Application Deadline must be a future date',
    //     },
    // },
    applicationLink: {
        errorMessage: 'Application Link is required and must be a valid URL',
        notEmpty: {
            errorMessage: 'Application Link is required',
        },
        // isURL: {
        //     errorMessage: 'Application Link must be a valid URL',
        // },
    },
    jobFunction: {
        errorMessage: 'Job Function is required and must be a non-empty string',
        notEmpty: {
            errorMessage: 'Job Function is required',
        },
        trim: true,
    },
    workSchedule: {
        errorMessage:
            'Work Schedule is required and must be a non-empty string',
        notEmpty: {
            errorMessage: 'Work Schedule is required',
        },
        trim: true,
    },
    visaSponsorship: {
        errorMessage:
            'Visa Sponsorship is required and must be one of "Yes" or "No"',
        notEmpty: {
            errorMessage: 'Visa Sponsorship is required',
        },
        trim: true,
        isIn: {
            options: [['Yes', 'No']],
            errorMessage: 'Visa Sponsorship must be either "Yes" or "No"',
        },
    },
    reportingManager: {
        errorMessage:
            'Reporting Manager is required and must be a non-empty string',
        notEmpty: {
            errorMessage: 'Reporting Manager is required',
        },
        trim: true,
    },
    customQueries: {
        errorMessage: 'Custom Queries must be a valid array of objects',
        optional: true,
        isArray: {
            errorMessage: 'Custom Queries must be an array',
        },
        custom: {
            options: (value: Array<Record<string, string>>) =>
                value.every(
                    (query) =>
                        typeof query.question === 'string' &&
                        query.type in { text: 1, 'multiple-choice': 1 } &&
                        (query.answer === undefined ||
                            (Array.isArray(query.answer) &&
                                query.answer.every(
                                    (a) => typeof a === 'string',
                                )) ||
                            typeof query.answer === 'string'),
                ),
            errorMessage: 'Each custom query must have valid fields',
        },
    },
});
