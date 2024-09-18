import { Request, Response, NextFunction } from 'express';
import { RequestJobData } from '../types/jobTypes';
import logger from '../config/logger';
import JobService from '../services/jobservice';
import { validationResult } from 'express-validator';
class JobController {
    constructor(private jobservice: JobService) {}
    async createJob(req: RequestJobData, res: Response, next: NextFunction) {
        const jobdata = req.body;

        const result = validationResult(req);
        if (!result.isEmpty()) {
            logger.error(result);
            return res.status(400).json({ errors: result.array() });
        }
        try {
            const jobpost = await this.jobservice.createJob(jobdata);
            logger.info('Data Successfully saved!');
            res.status(200).json({
                message: 'Job created successfully',
                data: jobpost,
            });
        } catch (err) {
            next(err);
        }
    }
    static getJobs(req: Request, res: Response) {
        res.json({ message: 'All jobs retrieved successfully' });
    }
    static getJobById(req: Request, res: Response) {
        res.json({ message: 'Job retrieved successfully' });
    }
    static updateJob(req: Request, res: Response) {
        res.status(200).json({ message: 'Job updated successfully' });
    }
    static deleteJob(req: Request, res: Response) {
        res.status(204).json({ message: 'Job deleted successfully' });
    }
    static applyForJob(req: Request, res: Response) {
        res.status(201).json({ message: 'Application submitted successfully' });
    }
    static getApplicationsForJob(req: Request, res: Response) {
        res.json({ message: 'All applications retrieved successfully' });
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
    static getJobsByCompany(req: Request, res: Response) {
        res.json({ message: 'All jobs retrieved for the company' });
    }
    static getJobsByLocation(req: Request, res: Response) {
        res.json({ message: 'All jobs retrieved for the location' });
    }
    static getJobsBySkills(req: Request, res: Response) {
        res.json({ message: 'All jobs retrieved for the skills' });
    }
    static getJobsByDate(req: Request, res: Response) {
        res.json({ message: 'All jobs retrieved for the date' });
    }
    static getJobsBySalary(req: Request, res: Response) {
        res.json({ message: 'All jobs retrieved for the salary' });
    }
    static getJobsByExperience(req: Request, res: Response) {
        res.json({ message: 'All jobs retrieved for the experience' });
    }
    static getJobsByEducation(req: Request, res: Response) {
        res.json({ message: 'All jobs retrieved for the education' });
    }
    static getJobsByIndustry(req: Request, res: Response) {
        res.json({ message: 'All jobs retrieved for the industry' });
    }
    static getJobsByJobType(req: Request, res: Response) {
        res.json({ message: 'All jobs retrieved for the job type' });
    }
    static getJobsByJobStatus(req: Request, res: Response) {
        res.json({ message: 'All jobs retrieved for the job status' });
    }
    static getJobsByJobTitle(req: Request, res: Response) {
        res.json({ message: 'All jobs retrieved for the job title' });
    }
    static getJobsByCompanySize(req: Request, res: Response) {
        res.json({ message: 'All jobs retrieved for the company size' });
    }
    static getJobsByCompanyType(req: Request, res: Response) {
        res.json({ message: 'All jobs retrieved for the company type' });
    }
}

export default JobController;
