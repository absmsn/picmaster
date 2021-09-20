import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PhotoInfoDto {
  @Expose()
  photoID: string;
  @Expose()
  albumID: string;
  @Expose()
  photoName: string;
  @Expose()
  modifiedTime: Date;
  @Expose()
  comment: string;
  @Expose()
  size: number;
}
