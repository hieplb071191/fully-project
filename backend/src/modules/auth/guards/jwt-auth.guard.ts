import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { SKIP_2FA_KEY } from '../decorators/skip-2fa.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(readonly reflector: Reflector) {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    console.log(user, info, context);
    this.reflector.getAllAndOverride(SKIP_2FA_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (user.bannedAt) {
      throw new UnauthorizedException('Your account is banned');
    }
    return user;
  }
}
