import {
  BadRequestException,
  Controller,
  Post,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService, HousePair } from './app.service';
import { Express } from 'express';
import * as csv from 'csvtojson';
import { Readable } from 'stream';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('unique-houses')
  @UseInterceptors(FileInterceptor('file'))
  async getUniqueHouses(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<number> {
    if (!file) {
      throw new BadRequestException('File not found');
    }

    if (!this.appService.isSupportedMimeType(file.mimetype)) {
      throw new UnsupportedMediaTypeException(
        'Not supported mimeType ' + file.mimetype,
      );
    }

    const housePairs: Array<HousePair> = await csv({
      noheader: true,
      headers: ['houseId', 'houseAddress'],
    }).fromStream(Readable.from(file.buffer));

    return this.appService.findUniqueHouses(housePairs);
  }
}
