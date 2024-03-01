import { Body, Controller, Delete, Get, Param, Patch, Post, Response, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidator } from '../commons/utils/file.util';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@Response({ passthrough: true }) res, @UploadedFile(FileValidator)
    file: Express.Multer.File) {
    return await this.reportService.create(res, file);
  }

  @Get()
  async findAll() {
    return this.reportService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reportService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportService.update(+id, updateReportDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.reportService.remove(+id);
  }
}