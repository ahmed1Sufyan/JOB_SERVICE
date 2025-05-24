/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { NextFunction, Request, Response } from 'express';
import { AiResponseController } from '../controllers/AiResponseController';
import fileUpload from 'express-fileupload';

const Airoutes = express.Router();

const AiResponseControl = new AiResponseController();
Airoutes.post(
    '/generateText',
    fileUpload(),
    async (req: Request, res: Response, next: NextFunction) => {
        await AiResponseControl.generateText(req, res, next);
    },
);
Airoutes.post(
    '/generateTest',
    async (req: Request, res: Response, next: NextFunction) => {
        await AiResponseControl.TestAI(req, res, next);
    },
);
Airoutes.post(
    '/chatbot',
    async (req: Request, res: Response, next: NextFunction) => {
        await AiResponseControl.generateText(req, res, next);
    },
);

export default Airoutes;
