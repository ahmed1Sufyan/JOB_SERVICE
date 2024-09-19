/* eslint-disable @typescript-eslint/await-thenable */
import { Repository } from 'typeorm';
import createHttpError from 'http-errors';
import { JobApplications } from '../entity/JobApplications';
import { JobApplication } from '../types/jobApplicationTypes';
class JobApplicationService {
    constructor(
        private JobApplicationRepository: Repository<JobApplications>,
    ) {}
    async ApplyforJob(jobApplicationdata: JobApplication) {
        try {
            const jobApp =
                await this.JobApplicationRepository.create(jobApplicationdata);
            const res = await this.JobApplicationRepository.save(jobApp);
            return res.applicationId;
        } catch (error) {
            const err = createHttpError(
                500,
                `Error Apply For Job ${error instanceof Error && error.message}`,
            );
            throw err;
        }
    }
    async getAllApplications(jobId: string) {
        try {
            const jobApplications =
                await this.JobApplicationRepository.createQueryBuilder(
                    'job_applications',
                )
                    .leftJoinAndSelect('job_applications.job', 'job') // Join the job entity
                    .where('job.id = :jobId', { jobId }) // Filter by specific job ID
                    .getMany();
            return jobApplications;
        } catch (error) {
            const err = createHttpError(
                500,
                `Error Getting All Applications for Job ${jobId} ${error instanceof Error && error.message}`,
            );
            throw err;
        }
    }
}

export default JobApplicationService;
