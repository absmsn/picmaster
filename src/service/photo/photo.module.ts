import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { AlbumService } from '../album/album.service';
import { Photo } from './photo.model';

@Module({
  imports: [SequelizeModule.forFeature([Photo])],
  controllers: [PhotoController],
  providers: [PhotoService, AlbumService],
})
export class PhotoModule {}
