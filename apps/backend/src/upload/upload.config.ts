import 'multer';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidV4 } from 'uuid';
import type { Request } from 'express';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';

export const generateFilename = (file: Express.Multer.File) => {
  const fileExtName = extname(file.originalname);
  const randomName = uuidV4();

  return `${Date.now()}-${randomName}${fileExtName}`;
};

const imageFileFilter = (
  _request: Request,
  file: Express.Multer.File,
  callback: (err: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return callback(
      new BadRequestException(
        `this file type is not supported: ${extname(file.originalname)}`,
      ),
      false,
    );
  }

  callback(null, true);
};

export const multerConfig: MulterOptions = {
  storage: memoryStorage(),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
