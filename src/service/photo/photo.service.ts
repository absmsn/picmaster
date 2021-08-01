import { Injectable } from '@nestjs/common';
import { AddPhotoDto } from './dto/add-photo.dto';
import { Photo } from './photo.model';
import { basename, extname } from 'path';
import CryptoTool from "../../utils/crypto-tool";

const hashKey = 'salt';

@Injectable()
export class PhotoService {
  async create(p: AddPhotoDto) {
    const photo = Photo.build();
    photo.photoID = CryptoTool.hash(CryptoTool.uuid(), 'sha256', hashKey);
    photo.albumID = p.albumID;
    photo.modifiedTime = new Date(parseInt(p.modifiedTime));
    photo.size = p.size;

    const suffix = extname(p.fileName);
    photo.photoName = basename(p.fileName, suffix);
    photo.physicalFileName = photo.photoID + suffix;
    return photo.save();
  }

  async get(where) {
    const photo = await Photo.findOne({
      where: where
    });
    if (photo) {
      await photo.increment('visitCount', {by: 1});
    }
    return photo;
  }

  async remove(photoID: string) {
    const photo = await this.get(photoID);
    await photo.destroy();
  }
}
