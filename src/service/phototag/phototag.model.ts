import { Column, Table, Model, ForeignKey } from 'sequelize-typescript';
import { Photo } from '../photo/photo.model';
import { Tag } from '../tag/tag.model';

@Table({ updatedAt: false })
export class PhotoTag extends Model {
  @ForeignKey(() => Photo)
  @Column
  photoId: number;

  @ForeignKey(() => Tag)
  @Column
  tagId: number;
}
