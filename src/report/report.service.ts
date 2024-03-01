import { Injectable, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as ffmpeg from 'ffmpeg';
import * as fs from 'fs';
import { dir } from 'tmp-promise';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Report } from './entities/report.entity';
import { IReport } from './interfaces/report.interface';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}
  async create(user: User, file: Express.Multer.File) {
    const existingReport: Report = await this.reportRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (existingReport) {
      return existingReport;
    }
    const tempDir = await dir({
      unsafeCleanup: true,
    });
    await fs.promises.writeFile(
      `${tempDir.path}/${file.originalname}`,
      file.buffer,
    );

    const proc = new ffmpeg(`${tempDir.path}/${file.originalname}`);
    return await proc.then(async (video) => {
      video.fnExtractFrameToJPG(`storage`, {
        number: 1,
        keep_pixel_aspect_ratio: true,
        keep_aspect_ratio: true,
      });

      const dotIndex = file.originalname.lastIndexOf('.');
      const fileName = file.originalname.substring(0, dotIndex);

      const filePath = `storage/${fileName}_1.jpg`;

      if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath);
        const file_blob = new Blob([buffer]);

        const formData = new FormData();
        formData.append('image', file_blob);
        const response = await axios.post(
          `${process.env.MODEL_API_URL}/process_image`,
          formData,
        );
        if (response.status === 200) {
          const reportData: IReport = response.data;
          const report: Report = this.reportRepository.create(reportData);
          report.user = user;
          return await this.reportRepository.save(report);
        }
      }
    });
  }

  async getImage(name: string) {
    const response = await axios.get(
      `${process.env.MODEL_API_URL}/image/${name}`,
      { responseType: 'arraybuffer' },
    );
    const buffer = Buffer.from(response.data, 'binary');
    return new StreamableFile(buffer);
  }
}
