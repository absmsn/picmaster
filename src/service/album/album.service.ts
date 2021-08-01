import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from './album.model';
import CryptoTool from "../../utils/crypto-tool";

const hashKey = 'salt';

@Injectable()
export class AlbumService {
  async findOne(where) {
    return await Album.findOne({
      where: where,
    });
  }

  async create(album: CreateAlbumDto): Promise<Album> {
    const a = Album.build();
    a.userID = album.userID;
    a.name = album.name;
    a.albumID = CryptoTool.hash(CryptoTool.uuid(), 'sha256', hashKey);
    return await a.save();
  }

  async remove(albumID: string) {
    const album = await this.findOne({albumID});
    if (album) {
      await album.destroy();
    }
  }
}
