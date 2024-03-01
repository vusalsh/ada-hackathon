import { Expose } from "class-transformer";

export class ReportResponseDto{
    @Expose()
    id: string;

    @Expose()
    gender: string;

    @Expose()
    ghd_rate: number;

    @Expose()
    depression_level: number;

    @Expose()
    cancer_rate: number;

    @Expose()
    smoke: number;

    @Expose()
    disease_rate: number;

    @Expose()
    file_path: string;
}
