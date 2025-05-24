/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-console */
import { Request, Response, NextFunction } from 'express';
import {
    getJobfilter,
    prompt,
    RequestJobData,
    updateData,
} from '../types/jobTypes';
import logger from '../config/logger';
import JobService from '../services/jobservice';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { configDotenv } from 'dotenv';
// import OpenAI from 'openai';
// import { log } from 'console';
// import generateTextAI from '../services/AI-Models';
import { getFilters } from '../services/getFilterService';
configDotenv();
class JobController {
    constructor(private jobservice: JobService) {}
    async getDescriptionBuilder(
        req: prompt,
        res: Response,
        next: NextFunction,
    ) {
        // const {
        //     title,
        //     // companyName,
        //     // experience,
        //     // soft_skills,
        //     // role,
        //     // qualification,
        // } = req.body;
        // // if (
        // // !title ||
        // //     !companyName ||
        // //     !experience ||
        // //     !soft_skills ||
        // //     !role ||
        // //     !qualification
        // // ) {
        // //     return res.json({ error: 'Give Essential Details About Jobs' });
        // // }
        // const openai = new OpenAI({
        //     baseURL: 'https://openrouter.ai/api/v1',
        //     apiKey: process.env.OPENROUTER_API_KEY!,
        // });

        // try {
        //     // const prompt = `Create a detailed job description of "20" words exact for a social media post in a concise and compress text manner for a ${title} at ${companyName}. Start with a short, engaging paragraph introducing the role and its significance within the company. Then, list the main responsibilities in bullet points. Next, list the qualifications and skills required in another set of bullet points, including ${experience} years of experience in ${role}, ${soft_skills}, and ${qualification}. Conclude with a brief paragraph describing the company’s values, culture, and any benefits or perks offered, making the role appealing and exciting for potential candidates.
        //     // response should be in clean format remove special characters or #,@,$,*,/n keep it clean and simple like human readable
        //     // `;
        //     // let prompt =
        //     // 'Make an interview like scenario start asking questions one by one for beginner react js developer to me,i will answer that what you ask if i dont know the answer give a postive reply and feedback and move on to the next question and repeat this process until you will have asked 10 questions about that topic now start!';
        //     // const prompt = title;
        //     // const completion = await openai.chat.completions.create({
        //     //     model: 'google/gemini-pro-1.5-exp',
        //     //     messages: [{ role: 'user', content: prompt }],
        //     // });
        //     // const stream = OpenAIStream(completion);

        //     // model: 'mistralai/pixtral-12b:free',
        //     // model: 'nousresearch/hermes-3-llama-3.1-405b:free',
        //     // model: 'openai/gpt-3.5-turbo',
        //     // console.log(completion.choices[0].message);
        //     // const response = new StreamingTextResponse(stream);
        //     // setInterval(() => {
        //     //     console.log(response);
        //     // }, 2000);
        //     // await generateTextAI(title);
        try {
            const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
            const model = genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
            });

            const prompt =
                'i want that when i ask any question to you you will response me in both text and voice mode . is it possible ?';
            // Write a detailed 300 words of job description for the role of [Job Title]. The job is located in karachi, with options for onsite work. The ideal candidate should have 3+ years of experience in Software Engineering. List the key responsibilities, required qualifications, and preferred skills. Emphasize the importance of React,spring boot,Mysql and any specific tools or technologies the candidate must be proficient in. Include details about the work environment, team collaboration, and any benefits the company offers.'
            // const result = await model.generateContent(prompt);
            // console.log(result.response.text());
            const result = await model.generateContentStream(prompt);

            // Print text as it comes in.
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                process.stdout.write(chunkText);
            }

            res.json({
                message: 'Generated description:',
                data: '',
            });
        } catch (error) {
            next(error);
        }
    }
    async createJob(req: RequestJobData, res: Response, next: NextFunction) {
        const jobdata = req.body;
        console.log(jobdata);

        // return res.status(400).json({ msg : "ok"});

        const result = validationResult(req);
        if (!result.isEmpty()) {
            logger.error(result);
        }
        try {
            // const data = {
            //        ...{ "name": jobdata?.company,
            //         "website": "https://davis.com/"
            //       },
            //     ...jobdata
            // }
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
    async getJobs(req: Request, res: Response, next: NextFunction) {
        try {
            // Destructure filters from query params
            const filterdata: getJobfilter = req.query;
            // Create query builder
            const filters = getFilters(filterdata);

            console.log(filters);
            const jobs = await this.jobservice.getJobs(filters);
            // logger.info(jobs);
            res.status(201).json({
                message: 'Jobs fetched successfully',
                length: jobs.length,
                data: jobs,
            });
        } catch (error) {
            const err = createHttpError(500, 'Error fetching jobs');
            logger.error('Error fetching jobs:', error);
            return next(err);
        }
    }
    async getJobById(req: Request, res: Response, next: NextFunction) {
        const id = parseInt(req.params.id);
        logger.debug(id);
        if (isNaN(id) || id == undefined) {
            throw createHttpError(400, 'Invalid ID provided');
        }

        const job = await this.jobservice.getJob(id);

        // console.log(job);

        if (!job) {
            res.json({ message: 'No Job Found' });
        }
        res.json({ message: 'Job retrieved successfully', data: job });
    }
    async getJobsById(req: Request, res: Response, next: NextFunction) {
        const id = parseInt(req.params.id);
        logger.debug(id);
        if (isNaN(id) || id == undefined) {
            throw createHttpError(400, 'Invalid ID provided');
        }

        const job = await this.jobservice.getJobsById(String(id));

        console.log(job);

        if (!job) {
            res.json({ message: 'No Job Found' });
        }
        res.json({ message: 'Job retrieved successfully', data: job });
    }
    updateJob(req: updateData, res: Response, next: NextFunction) {
        const { id } = req.params;
        const updatedData = req.body;
        const jobid = Number(id);
        if (!id || isNaN(jobid)) {
            return res.status(400).json({ error: 'Invalid ID provided' });
        }
        if (!updatedData) {
            return res
                .status(400)
                .json({ error: 'No data provided to update' });
        }
        try {
            // const response = await this.jobservice.updateJob(
            //     jobid,
            //     updatedData,
            // );
            res.json({ message: 'Job updated successfully', data: '' });
        } catch (error) {
            next(error);
        }
    }
    async deleteJob(req: Request, res: Response, next: NextFunction) {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id == undefined) {
            return res.status(400).json({ error: 'Invalid ID provided' });
        }
        try {
            await this.jobservice.deleteJob(id);
            res.json({ message: 'Job deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
    jobfilters(req: Request, res: Response) {
        res.json({
            data: req.body,
        });
    }
}

export default JobController;
