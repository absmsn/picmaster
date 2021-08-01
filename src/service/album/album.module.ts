import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { Album } from './album.model';

@Module({
  imports: [SequelizeModule.forFeature([Album])],
  providers: [AlbumService],
  controllers: [AlbumController],
})
export class AlbumModule {}
