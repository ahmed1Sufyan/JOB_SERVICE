import { Repository } from 'typeorm';
import { SavedJob } from '../entity/SavedJob';

export default class SavedJobService {
    constructor(private readonly savedJObRepo: Repository<SavedJob>) {}

    async SavedJob(userId: number, jobId: number) {
        const exist = await this.savedJObRepo.findOne({ where: { id: jobId } }); // Ensure job exists
        if (exist) {
            return exist.id;
        }
        const savejob = { userId, job: { id: jobId } };
        const data = this.savedJObRepo.create(savejob);
        return await this.savedJObRepo.save(data);
    }
    async getSavedJobs(userId: number) {
        return await this.savedJObRepo.find({
            where: { userId },
            relations: ['job'],
            select: {
                id: true,
                savedAt: true,
                job: {
                    id: true,
                    jobTitle: true, // Add the required fields from the Job entity
                    location: {
                        city: true,
                        country: true,
                        remoteOption: true,
                        state: true,
                    },
                    jobType: true,
                    salaryRange: {
                        currency: true,
                        maxSalary: true,
                        minSalary: true,
                    },
                    company: {
                        name: true,
                    },
                },
            },
        });
    }
    async DeleteSavedJob(jobId: number) {
        return await this.savedJObRepo.delete(jobId);
    }
}
