import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Jobs' })
export class Jobs {
    @PrimaryGeneratedColumn()
    id: string;

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

    @Column({ type: 'date' })
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

    // @ManyToOne(() => User, (user) => user.jobPosts)
    // user: User;
}
