import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from './album.model';
import CryptoTool from '../../utils/crypto-tool';
import { Photo } from '../photo/photo.model';

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
    const album = await this.findOne({ albumID });
    if (album) {
      await album.destroy();
    }
  }

  async listPhotos(albumID, offset, limit, order, desc) {
    return await Photo.findAll({
      attributes: [
        'photoID',
        'albumID',
        'photoName',
        'uploadTime',
        'modifiedTime',
        'visitCount',
        'comment',
        'size',
      ],
      where: {
        albumID: albumID,
      },
      // include: {
      //   model: Album,
      //   required: false,
      // },
      limit: limit,
      offset: offset,
      order: [[order, desc ? 'desc' : 'asc']],
    });
  }
}
