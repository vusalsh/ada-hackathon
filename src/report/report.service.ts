import { Injectable, StreamableFile } from '@nestjs/common';
import axios from 'axios';
import * as ffmpeg from 'ffmpeg';
import * as fs from 'fs';
import { dir } from 'tmp-promise';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportService {
  async create(file: Express.Multer.File) {
    const tempDir = await dir({
      unsafeCleanup: true
    });
      await fs.promises.writeFile(
        `${tempDir.path}/${file.originalname}`, file.buffer
      )

      const proc = new ffmpeg(`${tempDir.path}/${file.originalname}`);
      return proc.then(async(video) =>{
        video.fnExtractFrameToJPG(`storage`, {
          number: 1,
          keep_pixel_aspect_ratio : true,
          keep_aspect_ratio: true,
        })

        const dotIndex = file.originalname.lastIndexOf('.');
        const fileName =  file.originalname.substring(0, dotIndex);

        const filePath = `storage/${fileName}_1.jpg`;

        if(fs.existsSync(filePath)){
          const buffer = fs.readFileSync(filePath);
          const file_blob = new Blob([buffer]);

          const formData = new FormData();
          formData.append('image', file_blob);
          const response = await axios.post(`${process.env.MODEL_API_URL}/process_image`, formData);
          console.log(response.status);
          return response.data;
        }
      })
      
  }

  async getImage(name: string){
    const response = await axios.get(`${process.env.MODEL_API_URL}/image/${name}`, {responseType: 'arraybuffer'});
    const buffer = Buffer.from(response.data, 'binary');
    return new StreamableFile(buffer);
  }

  async findAll() {
    return `This action returns all report`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  async remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
