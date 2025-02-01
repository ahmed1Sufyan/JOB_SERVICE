import { Request, Response } from 'express';
import SavedJobService from '../services/savedjobService';
import { NextFunction } from 'express-serve-static-core';
import createHttpError from 'http-errors';

export default class SavedJobController {
    constructor(private readonly savedJobService: SavedJobService) {}

    async SavedJob(req: Request, res: Response, next: NextFunction) {
        const { userId, jobId } = req.body as { userId: number; jobId: number };

        if (!userId || !jobId) {
            return next(createHttpError(400, 'Invalid data provided'));
        }

        try {
            const data = await this.savedJobService.SavedJob(userId, jobId);
            return res.status(201).json({ data });
        } catch (error) {
            next(error);
        }
    }
    async getSavedJobs(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.params;

        if (!userId) {
            return next(createHttpError(401, 'Invalid User'));
        }

        try {
            const getSavedJobs = await this.savedJobService.getSavedJobs(
                Number(userId),
            );

            return res.status(200).json(getSavedJobs);
        } catch (error) {
            next(error);
        }
    }
    async DeleteSavedJob(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!id) {
            return next(createHttpError(400, 'Invalid Job'));
        }

        try {
            await this.savedJobService.DeleteSavedJob(Number(id));
        } catch (error) {
            next(error);
        }
    }
}
