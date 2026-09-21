import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../users/services/user.service';
import {
  AuthenticatedUser,
  JwtPayload,
} from '../interfaces/jwt-payload.interface';
import { LoginResponseDto } from '../dto/login-response.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUser> {
    const user = await this.usersService.findOne({ email: email });
    const isMatch = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!user || !isMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return {
      userId: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      sourceLogin: user.sourceLogin,
      isConfirm: user.isConfirm,
      isTwoFa: user.isTwoFa,
      loginAt: user.loginAt,
      bannedAt: user.bannedAt,
    };
  }

  async login(username: string, password: string): Promise<LoginResponseDto> {
    const user = await this.validateUser(username, password);

    return { accessToken: await this.jwtService.signAsync(user) };
  }

  async signup(body: SignUpDto): Promise<Partial<User> | null> {
    const oldUser = await this.usersService.findOneByUsernameOrEmail(
      body.username,
      body.email,
    );
    if (oldUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(body.password, 12);

    return await this.usersService.saveUser({
      ...body,
      passwordHash: passwordHash,
    });
  }
}
