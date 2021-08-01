import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './service/user/user.model';
import { Album } from './service/album/album.model';
import { Photo } from './service/photo/photo.model';
import { Tag } from './service/tag/tag.model';
import { PhotoTag } from './service/phototag/phototag.model';
import { TagModule } from './service/tag/tag.module';
import { UserModule } from './service/user/user.module';
import { AlbumModule } from './service/album/album.module';
import { PhotoModule } from './service/photo/photo.module';
import { get } from 'config';

@Module({
  imports: [
    SequelizeModule.forRoot(Object.assign( {
      models: [User, Album, Photo, Tag, PhotoTag],
    }, get('database'))),
    UserModule,
    AlbumModule,
    PhotoModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
