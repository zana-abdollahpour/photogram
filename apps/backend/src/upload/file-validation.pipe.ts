import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  private readonly maxSize = 5 * 1024 * 1024;

  transform(value: Express.Multer.File, _metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('no file provided');
    }

    if (value.size > this.maxSize) {
      throw new BadRequestException(
        `max file size exceeded (${this.maxSize / (1024 * 1024)}MB)`,
      );
    }

    return value;
  }
}

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  private readonly allowedTypes = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  transform(value: Express.Multer.File, _metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('no file provided');
    }

    if (!this.allowedTypes.includes(value.mimetype)) {
      throw new BadRequestException(
        `file type ${value.mimetype} is not allowed. allowed types: ${this.allowedTypes.join(',')}`,
      );
    }

    return value;
  }
}
