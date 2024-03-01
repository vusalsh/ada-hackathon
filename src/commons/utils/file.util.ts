import { FileTypeValidator, ParseFilePipe } from "@nestjs/common";

export const FileValidator = new ParseFilePipe({
    validators: [
      new FileTypeValidator({ fileType: 'mp4|avi|mpeg' }),
    ]
  });