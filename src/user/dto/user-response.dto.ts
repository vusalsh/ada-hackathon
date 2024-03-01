import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ReportResponseDto } from '../../report/dto/response/report-response.dto';
import { Report } from '../../report/entities/report.entity';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @ValidateNested()
  @Type(() => ReportResponseDto)
  report: Report;
}
