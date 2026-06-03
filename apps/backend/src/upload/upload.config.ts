import 'multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidV4 } from 'uuid';
import type { Request } from 'express';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const editFileName = (
  _request: Request,
  file: Express.Multer.File,
  callback: (err: Error | null, name: string) => void,
) => {
  const name = file.originalname.split('.').slice(0, -1).join('.');
  const fileExtName = extname(file.originalname);
  const randomName = uuidV4();
  callback(null, `${name}-${Date.now()}-${randomName}${fileExtName}`);
};

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: './uploads/images',
    filename: editFileName,
  }),
};
