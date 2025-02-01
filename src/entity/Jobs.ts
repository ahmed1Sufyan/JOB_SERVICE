/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JobApplications } from './JobApplications';
import { JobApplication } from '../types/jobApplicationTypes';
import { SavedJob } from './SavedJob';

@Entity({ name: 'jobs' })
export class Jobs {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'jsonb', nullable: true })
    company: Record<string, string>;

    @Column()
    jobTitle: string;

    @Column({ type: 'int', nullable: false })
    hiringPositions: number;

    @Column({ type: 'text' })
    jobDescription: string;

    @Column({ type: 'jsonb' })
    location: {
        city: string;
        state: string;
        country: string;
        remoteOption: string;
    };

    @Column({
        type: 'text',
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'],
        nullable: false,
        default: 'Full-time',
    })
    jobType: string;

    @Column({ type: 'jsonb' })
    salaryRange: {
        minSalary: number;
        maxSalary: number;
        currency: string;
    };

    @Column()
    experienceLevel: string;

    @Column('text', { array: true })
    skills: string[];

    @Column('text', { array: true })
    qualifications: string[];

    @Column()
    industry: string;

    @Column()
    jobCategory: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'date', default: () => 'null' })
    postDate: string;

    @Column({ type: 'date' })
    applicationDeadline: string;

    @Column()
    applicationLink: string;

    @Column()
    jobFunction: string;

    @Column()
    workSchedule: string;

    @Column()
    visaSponsorship: string;

    @Column()
    reportingManager: string;

    @Column({ type: 'jsonb', nullable: true })
    customQueries: {
        question: string; // The question text
        type: 'text' | 'multiple-choice'; // Type of answer: text or multiple-choice
        answer?: string | string[]; // Dynamic: single text answer or multiple options
    }[];

    @OneToMany(() => JobApplications, (application) => application.job)
    applications: JobApplication[];

    @Column({ type: 'text', nullable: true })
    employerId: string;

    @Column({ type: 'boolean', default: true })
    status: boolean;
    // @ManyToOne(() => User, (user) => user.jobPosts)
    // user: User;
    @OneToMany(() => SavedJob, (save) => save.job)
    savedByUsers: SavedJob;
}
