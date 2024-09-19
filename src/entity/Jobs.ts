/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JobApplications } from './JobApplications';
import { JobApplication } from '../types/jobApplicationTypes';

@Entity({ name: 'jobs' })
export class Jobs {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    jobTitle: string;

    @Column({ type: 'text' })
    jobDescription: string;

    @Column()
    companyName: string;

    @Column({ type: 'jsonb' })
    location: {
        city: string;
        state: string;
        country: string;
        remoteOption: string;
    };

    @Column()
    employmentType: string;

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

    @Column({ type: 'text' })
    companyOverview: string;

    @Column('text', { array: true })
    benefits: string[];

    @Column()
    jobFunction: string;

    @Column()
    workSchedule: string;

    @Column()
    visaSponsorship: string;

    @Column()
    numOpenings: number;

    @Column()
    reportingManager: string;

    @Column({ type: 'jsonb', nullable: true })
    customQueries: { question: string; type: string }[]; // JSON to store dynamic queries

    @OneToMany(() => JobApplications, (application) => application)
    applications: JobApplication[];

    // @ManyToOne(() => User, (user) => user.jobPosts)
    // user: User;
}
