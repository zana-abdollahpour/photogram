import { Inject, Injectable } from '@nestjs/common';

import { generateFilename } from 'src/upload/upload.config';
import {
  STORAGE_PROVIDER,
  type StorageProvider,
} from './storage/storage.interface';

@Injectable()
export class UploadService {
  constructor(
    @Inject(STORAGE_PROVIDER)
    private readonly storageProvider: StorageProvider,
  ) {}

  async uploadImage(file: Express.Multer.File) {
    const filename = generateFilename(file);
    const url = await this.storageProvider.upload(file, filename);
    return { filename, url };
  }
}
