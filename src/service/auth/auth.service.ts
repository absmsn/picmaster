import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService
  ) {}

  login(user: any) {
    const payload = { sub: user.userID };
    return this.jwtService.sign(payload);
  }
}
