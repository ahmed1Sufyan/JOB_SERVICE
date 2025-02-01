/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import SavedJobController from '../controllers/savedjobController';
import SavedJobService from '../services/savedjobService';
import { AppDataSource } from '../config/data-source';
import { SavedJob } from '../entity/SavedJob';

const savejobrouter = Router();

const savejobRepo = AppDataSource.getRepository(SavedJob);
const savejobservice = new SavedJobService(savejobRepo);
const savejobController = new SavedJobController(savejobservice);
// Get all saved jobs
savejobrouter.get(
    '/saved-jobs/:userId',
    async (req, res, next) =>
        await savejobController.getSavedJobs(req, res, next),
);

// Save a job
savejobrouter.post('/saved-jobs', (req, res, next) =>
    savejobController.SavedJob(req, res, next),
);

// Delete a saved job
savejobrouter.delete('/saved-jobs/:id', (req, res, next) =>
    savejobController.DeleteSavedJob(req, res, next),
);

export default savejobrouter;
