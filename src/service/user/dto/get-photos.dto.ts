import {
  IsBoolean,
  IsBooleanString, IsIn, IsInt,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString
} from "class-validator";
import { Type, Transform } from 'class-transformer';

export class GetPhotosDto {
  @Type(() => Number)
  @IsInt()
  offset: string;
  @Type(() => Number)
  @IsInt()
  limit: string;
  @IsIn(['modifiedTime', 'uploadTime', 'name', 'visitCount'])
  @IsString()
  order: string;
  @Transform(({value}) => {
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
