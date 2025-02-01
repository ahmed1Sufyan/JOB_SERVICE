/* eslint-disable @typescript-eslint/no-floating-promises */
import express, { Request, Response, NextFunction } from 'express';
import JobApplication from '../controllers/jobApplicationsController';
import JobApplicationService from '../services/jobApplicationService';
import { AppDataSource } from '../config/data-source';
import { JobApplications } from '../entity/JobApplications';
import fileUpload from 'express-fileupload';

const jobAppRoutes = express.Router();
const JobApplicationRepository = AppDataSource.getRepository(JobApplications);
const jobApplicationService = new JobApplicationService(
    JobApplicationRepository,
);
const jobApplications = new JobApplication(jobApplicationService);
// Mock data for jobs
jobAppRoutes
    .route('/applyforjob')
    .post(fileUpload(), (req: Request, res: Response, next: NextFunction) => {
        jobApplications.applyForJob(req, res, next);
    });
jobAppRoutes
    .route('/getApplications/:id')
    .get((req: Request, res: Response, next: NextFunction) => {
        jobApplications.getApplicationsForJob(req, res, next);
    });
jobAppRoutes
    .route('/sendmail')
    .post((req: Request, res: Response, next: NextFunction) => {
        jobApplications.sendMail(req, res, next);
    });
export default jobAppRoutes;
