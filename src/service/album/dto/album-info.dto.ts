import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AlbumInfoDto {
  @Expose()
  userID: string;
  @Expose()
  albumID: string;
  @Expose()
  name: string;
  @Expose()
  createTime: Date;
}
