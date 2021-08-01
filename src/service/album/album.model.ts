import {
  Column,
  Table,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  NotNull,
  HasMany,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Photo } from '../photo/photo.model';

@Table({ updatedAt: false })
export class Album extends Model<Album> {
  @PrimaryKey
  @NotNull
  @Column({ allowNull: false })
  albumID: string;

  @ForeignKey(() => User)
  @NotNull
  @Column({ allowNull: false })
  userID: string;

  @Column
  name: string;

  @CreatedAt
  @Column
  createTime: Date;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Photo)
  photos: Photo[];
}
