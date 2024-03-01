import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";


@Entity()
export class Report {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    gender: string;

    @Column()
    ghd_rate: number;

    @Column()
    depression_level: number;

    @Column()
    cancer_rate: number;

    @Column()
    smoke: number;

    @Column()
    disease_rate: number;

    @Column()
    file_path: string;

    @OneToOne(() => User, (user) => user.report)
    @JoinColumn()
    user: User
}
