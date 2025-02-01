/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/await-thenable */
import { Repository } from 'typeorm';
import { getJobfilter, JobData } from '../types/jobTypes';
import { Jobs } from '../entity/Jobs';
import createHttpError from 'http-errors';
import logger from '../config/logger';
class JobService {
    constructor(private JobRepository: Repository<Jobs>) {}
    async createJob(jobdata: JobData) {
        try {
            const job = await this.JobRepository.create(jobdata);
            const res = await this.JobRepository.save(job);
            return res.id;
        } catch (error) {
            const err = createHttpError(
                500,
                `Error creating job ${error instanceof Error && error.message}`,
            );
            throw err;
        }
    }
    async getJobs(filter: getJobfilter) {
        try {
            // Define the query builder
            let query = this.JobRepository.createQueryBuilder('jobs'); // Initialize the repository for the Job entity

            // Map of filters with respective query conditions
            // Add filter for job title if provided
            if (filter.jobTitle) {
                query = query.where('Jobs.jobTitle ILIKE :jobTitle', {
                    jobTitle: `%${filter.jobTitle}%`,
                });
            }

            if (filter.location) {
                query = query.andWhere('Jobs.location ILIKE :location', {
                    location: `%${filter.location}%`,
                });
            }

            if (filter.jobCategory) {
                query = query.andWhere('Jobs.jobCategory = :jobCategory', {
                    jobCategory: filter.jobCategory,
                });
                // Direct comparison for jobCategory
            }

            // Add filter for experience level if provided
            if (filter.experienceLevel) {
                query = query.andWhere(
                    'Jobs.experienceLevel = :experienceLevel',
                    { experienceLevel: filter.experienceLevel },
                );
                // Filter based on experience level using equality check
            }

            // Add filter for company name if provided
            if (filter.companyName) {
                query = query.andWhere('Jobs.companyName ILIKE :companyName', {
                    companyName: `%${filter.companyName}%`,
                });
                // Use wildcard search for companyName similar to jobTitle
            }

            // Add filter for work schedule if provided
            if (filter.workSchedule) {
                query = query.andWhere('Jobs.workSchedule = :workSchedule', {
                    workSchedule: filter.workSchedule,
                });
                // Work schedule is filtered using equality check
            }

            // Add filter for benefits if provided
            if (filter.benefits) {
                query = query.andWhere('Jobs.benefits ILIKE :benefits', {
                    benefits: `%${filter.benefits}%`,
                });
                // Benefits search uses wildcard matching
            }

            // Add filter for salary range if provided
            if (filter.salaryRange) {
                query = query.andWhere('Jobs.salaryRange = :salaryRange', {
                    salaryRange: filter.salaryRange,
                });
                // Salary range is filtered using direct comparison
            }

            // Add filter for employment type if provided
            if (filter.employmentType) {
                query = query.andWhere(
                    'Jobs.employmentType = :employmentType',
                    {
                        employmentType: filter.employmentType,
                    },
                );
                // Employment type filter uses equality check
            }

            // Add filter for skills if provided
            if (filter.skills) {
                query = query.andWhere('Jobs.skills ILIKE :skills', {
                    skills: `%${filter.skills}%`,
                });
                // Skills field uses wildcard and case-insensitive search
            }

            // Add filter for creation date if provided
            if (filter.createdAt) {
                query = query.andWhere('Jobs.createdAt >= :createdAt', {
                    createdAt: filter.createdAt,
                });
                // Filter jobs created after the given date
            }

            // Pagination: limit results per page
            const limit = filter.limit || 11; // Set a default limit if not provided
            const page = filter.page || 1; // Set the default page to 1 if not provided

            // Apply the limit and offset based on the page number
            query = query.take(limit).skip((page - 1) * limit);
            // 'take' specifies how many records to retrieve
            // 'skip' defines how many records to skip for pagination

            const jobs = await query.getMany(); // Fetch the matching jobs

            return jobs; // Return the filtered list of jobs
        } catch (error: unknown) {
            const err = createHttpError(
                500,
                `Error while getting jobss ${error}`,
            );
            throw err;
        }
    }
    async getJob(jobId: number) {
        // TODO: Implement logic to get a single job
        try {
            const job = await this.JobRepository.findOne({
                where: {
                    id: jobId,
                },
            });
            if (!job) {
                throw createHttpError(404, 'Job not found');
            }
            // logger.info(job);
            return job;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
    async updateJob() {
        // TODO: Implement logic to update a job
        // return await this.JobRepository.update({id : id},{...updatedData})
    }
    async deleteJob(id: number) {
        // TODO: Implement logic to delete a job
        try {
            const response = await this.JobRepository.delete({ id });
            if (!response) throw createHttpError(404, 'Job not found');
            return response;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
}

export default JobService;
