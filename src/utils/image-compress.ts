import sharp from 'sharp';
import streamifier from 'streamifier';
import { ReadStream } from 'fs';

export default class ImageCompress {
  static async compress(
    imagePath,
    targetWidth,
    targetHeight,
    format,
  ): Promise<ReadStream> {
    const buffer = await sharp(imagePath)
      .resize(targetWidth, targetHeight)
      .toFormat(format)
      .toBuffer();

    return streamifier.createReadStream(buffer);
  }
}
