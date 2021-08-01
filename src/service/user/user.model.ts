import {
  Column,
  Table,
  Model,
  CreatedAt,
  HasMany,
  NotNull,
  PrimaryKey,
} from 'sequelize-typescript';
import { Album } from '../album/album.model';

@Table({ updatedAt: false })
export class User extends Model<User> {
  @PrimaryKey
  @NotNull
  @Column({ allowNull: false })
  userID: string;

  @NotNull
  @Column({ allowNull: false })
  email: string;

  @NotNull
  @Column({ allowNull: false })
  passwordHash: string;

  @CreatedAt
  @Column
  registerTime: Date;

  @HasMany(() => Album)
  albums: Album[];
}
