import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ListPhotosDto } from './dto/list-photos.dto';
import { plainToClass } from 'class-transformer';
import { PhotoInfoDto } from '../photo/dto/photo-info.dto';
import { AlbumInfoDto } from '../album/dto/album-info.dto';
import storageManager from '../../utils/storage-manager';
import { ListAlbumsDto } from './dto/list-albums.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post()
  async register(@Body() user: CreateUserDto) {
    if (await this.userService.findOne({ email: user.email })) {
      throw new HttpException(
        { message: '邮箱已存在!' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const u = await this.userService.create(user);
    storageManager.createUserDir(u.userID);
  }

  @Get(':userID/photos')
  @UsePipes(new ValidationPipe({ transform: true }))
  async listPhotos(@Param('userID') userID, @Query() query: ListPhotosDto) {
    const { offset, limit, order, desc } = query;
    const ps = await this.userService.listPhotos(
      userID,
      offset,
      limit,
      order,
      desc,
    );
    return ps.map((photo) => plainToClass(PhotoInfoDto, photo));
  }

  @Get(':userID/albums')
  @UsePipes(new ValidationPipe({ transform: true }))
  async listAlbums(@Param('userID') userID, @Query() query: ListAlbumsDto) {
    const { offset, limit, desc } = query;
    const ps = await this.userService.listAlbums(userID, offset, limit, desc);
    return ps.map((album) => plainToClass(AlbumInfoDto, album));
  }

  @UsePipes(new ValidationPipe())
  @Post('/action/login')
  async login(@Body() user: LoginUserDto, @Res() res: Response) {
    const u = await this.userService.findOne({
      email: user.email,
      passwordHash: UserService.hashPassword(user.password),
    });
    if (!u) {
      throw new HttpException(
        { message: '用户名或密码不正确!' },
        HttpStatus.FORBIDDEN,
      );
    }
    const token = this.authService.login({ userID: u.userID });
    res.send({
      userID: u.userID,
      email: u.email,
      token: token,
    });
  }
}
