import {
  Body,
  Controller, Get,
  HttpException,
  HttpStatus, Param,
  Post, Query,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { UserService } from './user.service';
import { AuthService } from "../auth/auth.service";
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import storageManager from '../../utils/storage-manager';
import { GetPhotosDto } from "./dto/get-photos.dto";
import { plainToClass } from "class-transformer";
import { PhotoInfoDto } from "../photo/dto/photo-info.dto";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
              private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  async register(@Body() user: CreateUserDto) {
    if (await this.userService.findOne({email: user.email})) {
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
  async getPhotos(@Param('userID') userID, @Query() query: GetPhotosDto) {
    const { offset, limit, order, desc } = query;
    let ps = await this.userService.getPhotos(userID, offset, limit, order, desc);
    return ps.map((photo) => plainToClass(PhotoInfoDto, photo));
  }

  @UsePipes(new ValidationPipe())
  @Post('/action/login')
  async login(@Body() user: LoginUserDto) {
    const u = await this.userService.findOne({
      email: user.email,
      passwordHash: UserService.hashPassword(user.password)
    });
    if (!u) {
      throw new HttpException(
        { message: '用户名或密码不正确!' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = this.authService.login({ userID: u.userID });
    return {
      userID: u.userID,
      email: u.email,
      token: token
    };
  }
}
