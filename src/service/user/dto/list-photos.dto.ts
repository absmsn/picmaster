import { IsBoolean, IsIn, IsInt, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class ListPhotosDto {
  @Type(() => Number)
  @IsInt()
  offset: string;
  @Type(() => Number)
  @IsInt()
  limit: string;
  @IsIn(['modifiedTime', 'uploadTime', 'photoName', 'visitCount'])
  @IsString()
  order: string;
  @Transform(({ value }) => {
    if (!value) return true;
    try {
      return JSON.parse(value);
    } catch (e) {
      return false;
    }
  })
  @IsBoolean()
  desc: boolean;
}
