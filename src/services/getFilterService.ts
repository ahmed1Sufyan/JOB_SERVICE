import { getJobfilter } from '../types/jobTypes';

export const getFilters = (filterdata: getJobfilter) => {
    const filter: getJobfilter = {
        jobTitle: filterdata.jobTitle ? filterdata.jobTitle : undefined, // If they ask for a job title, we note it down
        location: filterdata.location ? filterdata.location : undefined, // If they ask for a location, we note it down
        jobCategory: filterdata.jobCategory
            ? filterdata.jobCategory
            : undefined, // If they ask for a location, we note it down
        experienceLevel: filterdata.experienceLevel
            ? filterdata.experienceLevel
            : undefined, // If they ask for a job type, we note it down
        companyName: filterdata.companyName
            ? filterdata.companyName
            : undefined, // If they ask for a company name, we note it down
        workSchedule: filterdata.workSchedule
            ? filterdata.workSchedule
            : undefined, // If they ask for a job type, we note it down
        employmentType: filterdata.employmentType
            ? filterdata.employmentType
            : undefined, // If they ask for a job type, we note it down
        salaryRange: filterdata.salaryRange
            ? filterdata.salaryRange
            : undefined, // If they ask for a salary range, we note it down
        limit: filterdata.limit ? Number(filterdata.limit) : 20, // If they ask for a limit, we note it down and convert it to a number
        page: filterdata.page ? Number(filterdata.page) : 1, // If they ask for a page number, we note it down and convert it to a number
        // If they ask for an employment type, we note it down
        // createdAt: filterdata.createdAt
        //     ? new Date(filterdata.createdAt)
        //     : undefined, // If they ask for a creation date, we note it down and convert it to a date
        skills: filterdata.skills ? filterdata.skills : undefined, // If they ask for skills, we note it down
    };
    return filter;
};
