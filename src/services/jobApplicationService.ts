import { Repository } from 'typeorm';
import createHttpError from 'http-errors';
import { JobApplications } from '../entity/JobApplications';
import { JobApplication } from '../types/jobApplicationTypes';
import { Jobs } from '../entity/Jobs';
class JobApplicationService {
    constructor(
        private JobApplicationRepository: Repository<JobApplications>,
    ) {}
    async ApplyforJob(jobApplicationdata: JobApplication) {
        // console.log("Job application data");
        // console.log(jobApplicationdata);

        try {
            const jobApp = this.JobApplicationRepository.create(
                // @ts-expect-error later will resolve
                jobApplicationdata as unknown as JobApplication,
            );
            const res = await this.JobApplicationRepository.save(jobApp);
            return res;
        } catch (error) {
            const err = createHttpError(
                500,
                `Error Apply For Job ${error instanceof Error && error.message}`,
            );
            throw err;
        }
    }
    async getAllApplications(applicationId: string) {
        try {
            const jobApplications = await this.JobApplicationRepository.find({
                where: {
                    applicationId,
                },
                relations: ['job'],
            });
            return jobApplications;
            // .createQueryBuilder(
            //     'job_applications',
            // )
            //     .leftJoinAndSelect('job_applications.job', 'job') // Join the job entity
            //     .where('job.id = :jobId', { jobId }) // Filter by specific job ID
            //     .getMany();
        } catch (error) {
            const err = createHttpError(
                500,
                `Error Getting All Applications for Job ${applicationId} ${error instanceof Error && error.message}`,
            );
            throw err;
        }
    }
    async hasApplied(applicantId: string, job: Jobs) {
        const application = await this.JobApplicationRepository.findOne({
            where: { applicantId, job: { id: job.id } },
            relations: ['job'], // Ensure relations are loaded if needed
        });

        return application; // If application exists, return true, else false
    }
}

export default JobApplicationService;
