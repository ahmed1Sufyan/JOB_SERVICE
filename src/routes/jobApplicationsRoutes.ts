/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
import express, { Request, Response, NextFunction } from 'express';
import JobApplication from '../controllers/jobApplicationsController';
import JobApplicationService from '../services/jobApplicationService';
import { AppDataSource } from '../config/data-source';
import { JobApplications } from '../entity/JobApplications';
import fileUpload from 'express-fileupload';
import { S3Storage } from '../common/S3Storage';
import { Jobs } from '../entity/Jobs';

const jobAppRoutes = express.Router();
const JobApplicationRepository = AppDataSource.getRepository(JobApplications);
const JobRepository = AppDataSource.getRepository(Jobs);
// const userRepository = AppDataSource.getRepository(user);
const jobApplicationService = new JobApplicationService(
    JobApplicationRepository,
    JobRepository,
);
const s3storage = new S3Storage();
const jobApplications = new JobApplication(jobApplicationService, s3storage);
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
    .route('/getApplicationsEmployer/:id')
    .get((req: Request, res: Response, next: NextFunction) => {
        jobApplications.getApplicationsForEmployer(req, res, next);
    });
jobAppRoutes
    .route('/updateApplications')
    .post((req: Request, res: Response, next: NextFunction) => {
        jobApplications.updateApplication(req, res, next);
    });
jobAppRoutes
    .route('/sendmail')
    .post((req: Request, res: Response, next: NextFunction) => {
        jobApplications.sendMail(req, res, next);
    });
export default jobAppRoutes;
