import { IsDate } from 'class-validator'

export class AddPhotoDto {
  albumID: string;
  fileName: string;
  @IsDate()
  modifiedTime: string;
  size: number;
}
