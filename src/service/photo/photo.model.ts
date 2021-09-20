import {
  Column,
  Table,
  Model,
  PrimaryKey,
  BelongsToMany,
  BelongsTo,
  ForeignKey,
  Default,
  CreatedAt,
} from 'sequelize-typescript';
import { Tag } from '../tag/tag.model';
import { Album } from '../album/album.model';
import { PhotoTag } from '../phototag/phototag.model';

@Table({ updatedAt: false })
export class Photo extends Model<Photo> {
  @PrimaryKey
  @Column
  photoID: string;

  @ForeignKey(() => Album)
  @Column
  albumID: string;

  @Column
  photoName: string;

  @Column
  physicalFileName: string;

  @CreatedAt
  @Column
  uploadTime: Date;

  @Column
  modifiedTime: Date;

  @Default(0)
  @Column
  visitCount: number;

  @Default('')
  @Column
  comment: string;

  @Column
  size: number;

  @BelongsToMany(() => Tag, () => PhotoTag)
  tags: Tag[];

  @BelongsTo(() => Album)
  album: Album;
}
