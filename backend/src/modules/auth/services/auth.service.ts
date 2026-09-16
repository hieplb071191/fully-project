import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../users/services/user.service';
import {
  AuthenticatedUser,
  JwtPayload,
} from '../interfaces/jwt-payload.interface';
import { LoginResponseDto } from '../dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<AuthenticatedUser> {
    const user = await this.usersService.findOne(username);
    const isMatch = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!user || !isMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return { userId: user.id, username: user.username };
  }

  async login(username: string, password: string): Promise<LoginResponseDto> {
    const user = await this.validateUser(username, password);
    const payload: JwtPayload = {
      sub: user.userId,
      username: user.username,
    };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
