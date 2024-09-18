/* eslint-disable @typescript-eslint/await-thenable */
import { Repository } from 'typeorm';
import { JobData } from '../types/jobTypes';
import { Jobs } from '../entity/Jobs';
import createHttpError from 'http-errors';
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
}

export default JobService;
