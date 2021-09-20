import {
  Controller,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Post,
  Body,
  Delete,
  Param,
  Get,
  Res,
  Req,
  Query,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoService } from './photo.service';
import { AlbumService } from '../album/album.service';
import storageManager from '../../utils/storage-manager';
import { plainToClass } from 'class-transformer';
import { PhotoInfoDto } from './dto/photo-info.dto';

@Controller('photo')
export class PhotoController {
  constructor(
    private readonly photoService: PhotoService,
    private readonly albumService: AlbumService,
  ) {}

  private static throwPhotoNotFound() {
    throw new HttpException(
      {
        message: '图片不存在',
      },
      HttpStatus.NOT_FOUND,
    );
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async addPhoto(@UploadedFile() file, @Body() body) {
    if (!file) {
      return;
    }
    const albumID = body.albumID;
    let album = await this.albumService.findOne({ albumID });
    if (!album) {
      throw new HttpException(
        {
          message: '相册不存在!',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const pDto = {
      albumID: albumID,
      modifiedTime: body.modifiedTime,
      fileName: file.originalname,
      size: file.size,
    };
    const photo = await this.photoService.create(pDto);
    album = await photo.$get('album');
    await storageManager.writePhoto(
      album.userID,
      albumID,
      photo.physicalFileName,
      file.buffer,
    );
    return plainToClass(PhotoInfoDto, photo);
  }

  @Get(':photoID')
  async getPhoto(
    @Param('photoID') photoID: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const photo = await this.photoService.get({ photoID });
    if (!photo) {
      PhotoController.throwPhotoNotFound();
    }
    const lastModified = req.get('last-modified');
    if (lastModified && lastModified === photo.uploadTime.toUTCString()) {
      res.sendStatus(HttpStatus.NOT_MODIFIED);
    }
    const album = await photo.$get('album');
    const stream = storageManager.readPhoto(
      album.userID,
      photo.albumID,
      photo.physicalFileName,
    );
    res.setHeader('last-modified', photo.uploadTime.toUTCString());
    stream.pipe(res);
  }

  @Get(':photoID/info')
  async getInfo(@Param('photoID') photoID: string) {
    const photo = await this.photoService.get({ photoID });
    if (!photo) {
      PhotoController.throwPhotoNotFound();
    }
    return plainToClass(PhotoInfoDto, photo);
  }

  @Delete(':photoID')
  async removePhoto(@Param('photoID') photoID: string) {
    const photo = await this.photoService.get({ photoID });
    if (!photo) {
      return;
    }
    const album = await photo.$get('album');
    await storageManager.deletePhoto(
      album.userID,
      photo.albumID,
      photo.physicalFileName,
    );
    await this.photoService.remove(photoID);
  }

  @Get(':photoID/thumbnail')
  async getThumbnail(
    @Param('photoID') photoID,
    @Query() query,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    let { width, height, format } = query;
    width = parseInt(width);
    height = parseInt(height);
    const photo = await this.photoService.get({ photoID });
    if (!photo) {
      PhotoController.throwPhotoNotFound();
    }
    const lastModified = req.get('last-modified');
    if (lastModified && lastModified === photo.uploadTime.toUTCString()) {
      res.sendStatus(HttpStatus.NOT_MODIFIED);
    }
    const album = await photo.$get('album');
    const stream = await storageManager.readThumbnail(
      album.userID,
      photo.albumID,
      photoID,
      photo.physicalFileName,
      width,
      height,
      format,
    );
    res.setHeader('last-modified', photo.uploadTime.toUTCString());
    stream.pipe(res);
  }
}
