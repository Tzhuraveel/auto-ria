import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

import { extname } from 'node:path';
import { v4 } from 'uuid';

@Injectable()
export class S3Service {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      secretAccessKey: this.configService.get<string>('AWS_S3_SECRET_KEY'),
      accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY'),
    },
  });

  constructor(private readonly configService: ConfigService) {}

  async upload(file: Express.Multer.File, itemType: string, itemId: string) {
    const filePath = this.buildPath(file.originalname, itemType, itemId);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
        Key: filePath,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: this.configService.get<string>('AWS_S3_ACL'),
      }),
    );

    return filePath;
  }

  private buildPath(
    fileName: string,
    itemType: string,
    itemId: string,
  ): string {
    return `${itemType}/${itemId}/${v4()}${extname(fileName)}`;
  }
}
