/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { NextFunction, Request, Response } from 'express';
import JobApplicationService from '../services/jobApplicationService';
import { jobApplicationData } from '../types/jobApplicationTypes';
import logger from '../config/logger';
import createHttpError from 'http-errors';

class JobApplication {
    constructor(private jobApplicationService: JobApplicationService) {}

    async applyForJob(
        req: jobApplicationData,
        res: Response,
        next: NextFunction,
    ) {
        const jobappdata = req.body;
        try {
            await this.jobApplicationService.ApplyforJob(jobappdata);
            return res.status(201).json({
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
        logger.debug(id);
        if (id == undefined) {
            throw createHttpError(400, 'Invalid ID provided');
        }
        try {
            const job = await this.jobApplicationService.getAllApplications(id);
            logger.error(job);
            if (!job || job == null || job.length == 0) {
                return res.status(404).json({
                    message: 'No job applications found for this job',
                    data: [],
                });
            }
            return res.json({
                message: 'Job Applications retrieved successfully',
                data: job,
            });
        } catch (error: unknown) {
            const err = createHttpError(500, `Something went wrong ${error}`);
            return next(err);
        }
    }
    static getApplicationById(req: Request, res: Response) {
        res.json({ message: 'Application retrieved successfully' });
    }
    static updateApplication(req: Request, res: Response) {
        res.status(200).json({ message: 'Application updated successfully' });
    }
    static deleteApplication(req: Request, res: Response) {
        res.status(204).json({ message: 'Application deleted successfully' });
    }
}
export default JobApplication;
