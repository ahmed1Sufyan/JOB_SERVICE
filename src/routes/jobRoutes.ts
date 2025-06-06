/* eslint-disable @typescript-eslint/no-floating-promises */
import express, { Request, Response, NextFunction } from 'express';
import JobController from '../controllers/jobController';
import JobService from '../services/jobservice';
import { AppDataSource } from '../config/data-source';
import { Jobs } from '../entity/Jobs';
import { jobDataValidation } from '../validators/jobData-validators';
const jobRoutes = express.Router();

const JobRepository = AppDataSource.getRepository(Jobs);
const jobservice = new JobService(JobRepository);
const jobController = new JobController(jobservice);
// Mock data for jobs
jobRoutes
    .route('/jobcreate')
    .post(
        jobDataValidation,
        (req: Request, res: Response, next: NextFunction) => {
            jobController.createJob(req, res, next);
        },
    );
jobRoutes
    .route('/job/:id')
    .get((req: Request, res: Response, next: NextFunction) => {
        jobController.getJobById(req, res, next);
    });
jobRoutes
    .route('/jobs/:id')
    .get((req: Request, res: Response, next: NextFunction) => {
        jobController.getJobsById(req, res, next);
    });
jobRoutes
    .route('/jobs')
    .get((req: Request, res: Response, next: NextFunction) => {
        jobController.getJobs(req, res, next);
    });
jobRoutes
    .route('/job/description-builder')
    .post((req: Request, res: Response, next: NextFunction) => {
        jobController.getDescriptionBuilder(req, res, next);
    });
export default jobRoutes;
