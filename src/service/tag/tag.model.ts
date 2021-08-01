import {
  Column,
  Table,
  Model,
  BelongsToMany,
  PrimaryKey,
} from 'sequelize-typescript';
import { Photo } from '../photo/photo.model';
import { PhotoTag } from '../phototag/phototag.model';

@Table({ updatedAt: false })
export class Tag extends Model<Tag> {
  @PrimaryKey
  @Column
  tagID: string;

  @Column
  userID: string;

  @Column
  name: string;

  @BelongsToMany(() => Photo, () => PhotoTag)
  photos: Photo[];
}
