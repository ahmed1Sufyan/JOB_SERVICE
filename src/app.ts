import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { HttpError } from 'http-errors';
import logger from './config/logger';
import jobRoutes from './routes/jobRoutes';
const app = express();

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use('/api', jobRoutes);
app.use((err: HttpError, _req: Request, res: Response) => {
    if (err instanceof Error) logger.error(err.message);
    const statuscode = err.statusCode || err.status || 500;
    res.status(statuscode).json({
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
