import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as ffmpeg from 'ffmpeg';
import * as fs from 'fs';
import { join } from 'path';
import { dir } from 'tmp-promise';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportService {
  async create(res: Response, file: Express.Multer.File) {
    const tempDir = await dir({
      unsafeCleanup: true
    });
    try{
  
      await fs.promises.writeFile(
        `${tempDir.path}/${file.originalname}`, file.buffer
      )

      const proc = new ffmpeg(`${tempDir.path}/${file.originalname}`);
      proc.then((video) =>{
        video.fnExtractFrameToJPG(`storage`, {
          number: 1,
          keep_pixel_aspect_ratio : true,
          keep_aspect_ratio: true,
        })
        const path = `storage/big_buck_bunny_720p_5mb_1.jpg`;
        if(fs.existsSync(path)){
          const file = fs.createReadStream(join(process.cwd(), path));
          console.log(file);
        }
        else{
          throw new BadRequestException("No file.");
        }
      })
    }
    catch(e){
      console.log(e);
    }
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
