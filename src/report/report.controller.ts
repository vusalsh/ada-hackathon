import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Serialize } from '../commons/interceptors/serialize.interceptor';
import { FileValidator } from '../commons/utils/file.util';
import { User } from '../user/entities/user.entity';
import { ReportResponseDto } from './dto/response/report-response.dto';
import { ReportService } from './report.service';

@Controller('report')
@ApiTags('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Auth()
  @Serialize(ReportResponseDto)
  async create(
    @CurrentUser() user: User,
    @UploadedFile(FileValidator)
    file: Express.Multer.File,
  ) {
    return await this.reportService.create(user, file);
  }

  @Get('/image/:name')
  async getImage(@Param('name') name: string) {
    return await this.reportService.getImage(name);
  }
}
