import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { Jobs } from './Jobs';
export enum ApplicationStatus {
    APPLIED = 'Applied',
    SHORTLISTED = 'Shortlisted',
    INTERVIEW_SCHEDULED = 'Interview Scheduled',
    REJECTED = 'Rejected',
    HIRED = 'Hired',
}

@Entity()
export class JobApplications {
    @PrimaryGeneratedColumn()
    applicationId: string;

    @ManyToOne(() => Jobs, (Job) => Job.applications, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    job: Jobs;

    @Column()
    applicantId: string;

    @Column({ type: 'text', nullable: true })
    resume_Url?: string; // URL or file path

    @Column({ type: 'text', nullable: true })
    coverLetter: string;

    @CreateDateColumn({ type: 'timestamp' })
    applicationDate: Date | string;

    @Column({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.APPLIED, // Default to 'Applied'
    })
    status: ApplicationStatus; // Using enum type here
    // @Column({ type: 'timestamp', nullable: true })
    // interviewDate: Date;

    // @Column({ type: 'text', nullable: true })
    // notes: string;

    @Column({ type: 'text', array: true, nullable: true })
    skillsMatched?: string[]; // Array of matched skills

    @Column({ type: 'varchar', nullable: true })
    experienceLevel?: string; // e.g., Entry-level, Mid-level, Senior-level

    @Column({ type: 'text', nullable: true })
    feedback?: string;

    // @Column({ type: 'timestamp', nullable: true })
    // followUp: Date; // Follow-up date if required
}

// const job = await jobRepository.findOne({ where: { id: 1 }, relations: ['applications'] });
// console.log(job.applications); // Will log all the applications related to the job with id = 1
// In this case, the job.applications field will contain all the JobApplications records linked to that specific job.
