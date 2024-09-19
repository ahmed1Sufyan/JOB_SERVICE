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
            const queryBuilder =
                await this.JobRepository.createQueryBuilder('jobs');

            // // Create a mapping of filter conditions
            const filters = {
                title: filter.title
                    ? {
                          field: 'job.title',
                          operator: 'ILIKE',
                          value: `%${filter.title}%`,
                      }
                    : null,
                location: filter.location
                    ? {
                          field: 'job.location',
                          operator: 'ILIKE',
                          value: `%${filter.location}%`,
                      }
                    : null,
                jobType: filter.jobType
                    ? {
                          field: 'job.jobType',
                          operator: '=',
                          value: filter.jobType,
                      }
                    : null,
                company: filter.company
                    ? {
                          field: 'job.company',
                          operator: 'ILIKE',
                          value: `%${filter.company}%`,
                      }
                    : null,
            };

            // Apply dynamic filters
            Object.values(filters).forEach((filter) => {
                if (filter) {
                    queryBuilder.andWhere(
                        `${filter.field} ${filter.operator} :value`,
                        { value: filter.value },
                    );
                }
            });

            // Apply salary range filter if provided
            if (filter.salaryRange) {
                const [minSalary, maxSalary] = filter.salaryRange.split('-');
                queryBuilder.andWhere('job.salary >= :minSalary', {
                    minSalary,
                });
                queryBuilder.andWhere('job.salary <= :maxSalary', {
                    maxSalary,
                });
            }

            // Pagination: skip and take (limit)
            await queryBuilder
                .skip((Number(filter.page) - 1) * Number(filter.limit)) // Calculate offset for pagination
                .take(Number(filter.limit)) // Limit the number of results
                .getMany();

            // Count total jobs for pagination info
            await queryBuilder.getCount();
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
    updateJob() {
        // TODO: Implement logic to update a job
    }
    deleteJob() {
        // TODO: Implement logic to delete a job
    }
}

export default JobService;
