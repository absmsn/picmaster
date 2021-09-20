import { IsBoolean, IsInt } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class ListAlbumsDto {
  @Type(() => Number)
  @IsInt()
  offset: string;
  @Type(() => Number)
  @IsInt()
  limit: string;
  @Transform(({ value }) => {
    if (!value) return false;
    try {
      return JSON.parse(value);
    } catch (e) {
      return false;
    }
  })
  @IsBoolean()
  desc: boolean;
}
