import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Get,
  UseGuards,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { AlbumService } from './album.service';
import storageManager from '../../utils/storage-manager';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ListPhotosDto } from './dto/list-photos.dto';
import { plainToClass } from 'class-transformer';
import { PhotoInfoDto } from '../photo/dto/photo-info.dto';
import { AlbumInfoDto } from './dto/album-info.dto';

// @UseGuards(JwtAuthGuard)
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  async addAlbum(@Body() album: CreateAlbumDto) {
    if (
      await this.albumService.findOne({
        name: album.name,
        userID: album.userID,
      })
    ) {
      throw new HttpException(
        {
          message: '相册已经存在!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const a = await this.albumService.create(album);
    storageManager.createAlbumDir(album.userID, a.albumID);
    return plainToClass(AlbumInfoDto, a);
  }

  @Delete(':albumID')
  async removeAlbum(@Param() params) {
    const album = await this.albumService.findOne({ albumID: params.albumID });
    if (!album) {
      throw new HttpException(
        {
          message: '相册不存在!',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.albumService.remove(params.albumID);
    await storageManager.deleteAlbumDir(album.userID, params.albumID);
  }

  @Get(':albumID/photos')
  @UsePipes(new ValidationPipe({ transform: true }))
  async listPhotos(@Param('albumID') albumID, @Query() query: ListPhotosDto) {
    const { offset, limit, order, desc } = query;
    const ps = await this.albumService.listPhotos(
      albumID,
      offset,
      limit,
      order,
      desc,
    );
    return ps.map((photo) => plainToClass(PhotoInfoDto, photo));
  }
}
