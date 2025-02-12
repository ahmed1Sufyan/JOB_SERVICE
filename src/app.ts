/* eslint-disable @typescript-eslint/no-unsafe-call */
import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { HttpError } from 'http-errors';
import logger from './config/logger';
import jobRoutes from './routes/jobRoutes';
import jobAppRoutes from './routes/jobApplicationsRoutes';
import cors from 'cors';
import Airoutes from './routes/AiRoutes';
import bodyparser from 'body-parser';
import savejobrouter from './routes/SavedJobRoutes';
const app = express();

app.use(bodyparser.json({ limit: '50mb' }));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use('/api', jobRoutes);
app.use('/api', jobAppRoutes);
app.use('/api', Airoutes);
app.use('/api', savejobrouter);

app.use((err: HttpError, _req: Request, res: Response) => {
    if (err instanceof Error) logger.error(err.message);
    const statuscode = err?.statusCode || err?.status || 500;
    res?.status(statuscode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: '',
                location: '',
            },
        ],
    });
});
export default app;
