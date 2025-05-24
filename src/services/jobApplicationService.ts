/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Repository } from 'typeorm';
import createHttpError from 'http-errors';
import { ApplicationStatus, JobApplications } from '../entity/JobApplications';
import { JobApplication } from '../types/jobApplicationTypes';
import { Jobs } from '../entity/Jobs';
import logger from '../config/logger';
class JobApplicationService {
    constructor(
        private JobApplicationRepository: Repository<JobApplications>,
        private Job: Repository<Jobs>,
    ) {}
    async ApplyforJob(jobApplicationdata: JobApplication) {
        // console.log("Job application data");
        console.log(jobApplicationdata);

        try {
            const jobApp = this.JobApplicationRepository.create(
                // @ts-expect-error  later resolve
                jobApplicationdata,
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
    async getAllApplications(applicantId: string, status?: string) {
        let jobApplications;
        try {
            if (status) {
                jobApplications = await this.JobApplicationRepository.find({
                    where: {
                        applicantId,
                        status: ApplicationStatus.SHORTLISTED,
                    },
                    relations: ['job'],
                });
            } else {
                jobApplications = await this.JobApplicationRepository.find({
                    where: {
                        applicantId,
                    },
                    relations: ['job'],
                });
            }
            return jobApplications;
        } catch (error) {
            const err = createHttpError(
                500,
                `Error Getting All Applications for Job ${applicantId} ${error instanceof Error && error.message}`,
            );
            throw err;
        }
    }
    async getAllApplicationsByemployer(employerId: string) {
        try {
            const findjobs = await this.Job.find({
                where: {
                    employerId,
                },
                select: {
                    id: true,
                },
            });

            const jobApplications = await Promise.all(
                findjobs.map(async (job) => {
                    return await this.JobApplicationRepository.find({
                        where: { job },
                        relations: ['job'],
                    });
                }),
            );

            logger.info(`find job ${jobApplications}`);
            // return findjobs
            return jobApplications.flat(1);
        } catch (error) {
            const err = createHttpError(
                500,
                `Error Getting All Applications for Job  ${error instanceof Error && error.message}`,
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
    async updateApplications(data: {
        status: string;
        userId: string;
        jobId: number;
    }) {
        //  const record = await this.JobApplicationRepository.findOne({
        //     where : {
        //         applicantId : data.userId,
        //         job : {
        //            id : data.jobId
        //         }
        //     }
        // })
        const record = await this.JobApplicationRepository.findOneBy({
            applicantId: data.userId,
            job: {
                id: data.jobId,
            },
        });
        console.log(record);
        // return record
        if (record) {
            // @ts-expect-error later on
            record.status = data.status;
            return await this.JobApplicationRepository.save(record);
        }
        return record;
    }
}

export default JobApplicationService;
