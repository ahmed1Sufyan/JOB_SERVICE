/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { NextFunction, Request, Response } from 'express';
import JobApplicationService from '../services/jobApplicationService';
import { jobApplicationData } from '../types/jobApplicationTypes';
import logger from '../config/logger';
import createHttpError from 'http-errors';
import { log } from 'console';
import { AppDataSource } from '../config/data-source';
import { Jobs } from '../entity/Jobs';
import nodemailer from 'nodemailer';
import { UploadedFile } from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import { S3Storage } from '../common/S3Storage';
import { getMatchedSkills } from '../services/skillsMatched';

class JobApplication {
    constructor(
        private jobApplicationService: JobApplicationService,
        private S3Storage: S3Storage,
    ) {}

    async applyForJob(
        req: jobApplicationData,
        res: Response,
        next: NextFunction,
    ) {
        const { jobId, applicantId, applicationDate, skills, experienceLevel } =
            req.body;
        console.log(req.body);
        // return res.json({data : "ok"})
        if (
            !jobId ||
            !applicantId ||
            !applicationDate ||
            !skills ||
            !experienceLevel
        ) {
            return res.json({
                message: 'Provide Valid Data',
            });
        }
        const jobrepo = AppDataSource.getRepository(Jobs);
        const job = await jobrepo.findOne({
            where: {
                id: Number(jobId),
            },
        });
        // console.log(job)
        if (!job) {
            return res.status(200).json({
                message: 'job not found',
            });
        }

        const file = req?.files?.resume as UploadedFile; // Assuming 'resume' is the key from the frontend
        let resume;
        if (file) {
            const name = `${uuidv4()}.${file.mimetype.split('/')[1]}`;
            resume = await this.S3Storage.uploadFile({
                filename: name,
                fileData: file.data,
            });

            // resp.push(uploadedFile);
        }

        let hasApplied;
        if (job) {
            hasApplied = await this.jobApplicationService.hasApplied(
                applicantId,
                job!,
            );
        }
        if (hasApplied) {
            return res.status(401).json({
                status: 401,
                message: 'You Have Already apply this job',
            });
        }
        let skillsMatched;
        if (skills) {
            // console.log(skills)
            logger.info(JSON.stringify(job?.skills));
            const userskills = (skills as unknown as string)
                .split(',')
                .map((skill) => skill.trim());
            // console.log(userskills);

            skillsMatched = getMatchedSkills(userskills, job?.skills!);
        }
        logger.info(`skillsMatched ${JSON.stringify(skillsMatched)}`);
        try {
            // @ts-expect-error later will solve
            const resp = await this.jobApplicationService.ApplyforJob({
                ...(resume && { resume_Url: resume }),
                ...(job && { job }),
                applicantId,
                ...(applicationDate && { applicationDate }),
                ...(skillsMatched && { skillsMatched }),
                experienceLevel,
            } as unknown as JobApplication);

            console.log(resp);

            return res.json({
                id: resp,
                message: 'Application submitted successfully',
            });
        } catch (error) {
            return next(error);
        }
    }
    async getApplicationsForJob(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const id = req.params.id;
        const { status } = req.query;
        console.log(req.query);

        logger.debug(id);
        if (id == undefined) {
            throw createHttpError(400, 'Invalid ID provided');
        }
        try {
            let job;

            if (status) {
                job = await this.jobApplicationService.getAllApplications(
                    id,
                    status as string,
                );
            } else
                job = await this.jobApplicationService.getAllApplications(id);
            // logger.error(job);
            if (!job || job == null) {
                log(job);
                return res.status(404).json({
                    message: 'No job applications found for this job',
                    data: [],
                });
            }
            console.log(job);

            return res.json({
                message: 'Job Applications retrieved successfully',
                data: job,
            });
        } catch (error: unknown) {
            const err = createHttpError(500, `Something went wrong ${error}`);
            return next(err);
        }
    }
    async getApplicationsForEmployer(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const id = req.params.id;
        logger.debug(id);
        if (id == undefined) {
            throw createHttpError(400, 'Invalid ID provided');
        }
        try {
            const job =
                await this.jobApplicationService.getAllApplicationsByemployer(
                    id,
                );
            // logger.error(job);
            if (job == null) {
                // log(job);
                return res.status(404).json({
                    message: 'No job applications found for this job',
                    data: [],
                });
            }
            const modified = job.map((j) => {
                if (j.resume_Url)
                    return {
                        ...j,
                        resume_Url: this.S3Storage.getObjectUrl(j.resume_Url),
                    };

                return j;
            });

            return res.json({
                message: 'Job Applications retrieved successfully',
                data: modified,
            });
        } catch (error: unknown) {
            const err = createHttpError(500, `Something went wrong ${error}`);
            return next(err);
        }
    }
    static getApplicationById(req: Request, res: Response) {
        res.json({ message: 'Application retrieved successfully' });
    }
    async updateApplication(req: Request, res: Response, next: NextFunction) {
        const { status, userId, jobId } = req.body;
        console.log(status);
        console.log(userId);
        console.log(jobId);

        if (!status || !userId || !jobId) {
            return res.status(400).json({ message: 'Invalid Data' });
        }
        const data = {
            status: status as string,
            userId: userId as string,
            jobId: jobId as number,
        };
        try {
            const resp =
                await this.jobApplicationService.updateApplications(data);
            res.status(200).json({
                message: 'Application updated successfully',
                data: resp,
            });
        } catch (error) {
            next(createHttpError(400, `something went wrong : ${error}`));
        }
    }
    static deleteApplication(req: Request, res: Response) {
        res.status(204).json({ message: 'Application deleted successfully' });
    }

    async sendMail(req: Request, res: Response, next: NextFunction) {
        const { name, email, text, to, subject } = req.body;

        // console.log(req.body);

        if (!name || !email || !text || !to)
            return res.json({ message: 'invalid fields' });
        try {
            // Create a transporter object
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com', // Replace with your SMTP server
                service: 'gmail',
                port: 587, // Replace with the port used by your SMTP server
                secure: false, // Use true for 465, false for other ports
                auth: {
                    user: 'csc21s135@gmail.com', // Replace with your email
                    pass: 'obmhjhfzsxxrsbif', // Replace with your email password
                },
            });

            // Email options
            const mailOptions = {
                from: `${name} <${email}>`, // Sender address
                to: 'Csc21s135@gmail.com', // Recipient address
                subject:
                    subject ||
                    `Congratulations, ${name}! You've Been Shortlisted for Frontend Developer`,
                html: text, // Subject line
                //   html :  `
                //   <p>Dear ${name},</p>

                //   <p>We are excited to inform you that you have been shortlisted for the position of <strong>Frontend Developer</strong> at our company.</p>

                //   <p>Next Steps:</p>
                //   <p>We kindly request you to confirm your availability for the interview by replying to this email at your earliest convenience.</p>

                //   <p>Should you have any questions or require additional information, please feel free to contact us.</p>

                //   <p>Looking forward to your response and wishing you the best for the interview process!</p>

                //   <p>Best regards,</p>
                //   <p>The Hiring Team</p>
                //   <p><em>Company Name</em></p>
                // `,
            };

            // Send email
            const info = await transporter.sendMail(mailOptions);

            logger.info('Email sent: %s', info.messageId);
            return res.json({
                success: true,
                message: 'Email sent successfully',
            });
        } catch (error) {
            logger.error('Error sending email:', error);
            return next(error);
        }
    }
}
export default JobApplication;
