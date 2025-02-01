import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { Jobs } from './Jobs';
// import { Job } from './Job';

@Entity()
export class SavedJob {
    @PrimaryGeneratedColumn()
    id: number;

    //   @ManyToOne(() => User, (user) => user.savedJobs, { onDelete: 'CASCADE' })
    @Column()
    userId: number;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    @ManyToOne(() => Jobs, (job) => job.savedByUsers, { onDelete: 'CASCADE' })
    job: Jobs;

    @CreateDateColumn()
    savedAt: Date;
}
