import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserService } from './user.service';
import { AuthService } from "../auth/auth.service";
import { UserController } from './user.controller';
import { AuthModule } from "../auth/auth.module";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
  imports: [SequelizeModule.forFeature([User]), AuthModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
