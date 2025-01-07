import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '@/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    private readonly _configService: ConfigService,
    private readonly _userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: _configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  public async validate({ id }: { id: string }) {
    return this._userService.getById(id);
  }
}
