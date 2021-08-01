import {
  Body,
  Controller, Delete,
  HttpException,
  HttpStatus, Param,
  Post, UseGuards
} from "@nestjs/common";
import { CreateAlbumDto } from './dto/create-album.dto';
import { AlbumService } from './album.service';
import storageManager from '../../utils/storage-manager';
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

// @UseGuards(JwtAuthGuard)
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  async addAlbum(@Body() album: CreateAlbumDto) {
    if (await this.albumService.findOne({
      name: album.name,
      userID: album.userID
    })) {
      throw new HttpException(
        {
          message: '相册已经存在!',
        }, HttpStatus.BAD_REQUEST,
      );
    }
    const a = await this.albumService.create(album);
    storageManager.createAlbumDir(album.userID, a.albumID);
  }

  @Delete(':albumID')
  async removeAlbum(@Param() params) {
    const album = await this.albumService.findOne({albumID: params.albumID});
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
}
