import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  ghd_rate: number;

  @Column({ nullable: true })
  depression_level: number;

  @Column({ nullable: true })
  cancer_rate: number;

  @Column({ nullable: true })
  smoke: number;

  @Column({ nullable: true })
  disease_rate: number;

  @Column({ nullable: true })
  file_path: string;

  @OneToOne(() => User, (user) => user.report)
  @JoinColumn()
  user: User;
}
