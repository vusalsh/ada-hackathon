import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { UserService } from '../../user/user.service';
import jwtConstants from '../constants/jwt.constant';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
  
  @Injectable()
  export class JwtGuard extends PassportStrategy(Strategy, 'jwt') {
    constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
    ) {
      super();
    }
  
    async validate(req: Request) {
      const accessToken: string = req.cookies?.accessToken;

  
      if (!accessToken) {
        throw new UnauthorizedException('No access token.');
      }
  

      let payload: JwtPayloadDto;
  
      try {
        payload = await this.jwtService.verifyAsync(accessToken, {
          secret: jwtConstants.accessSecret,
        });
      } catch (e) {
        throw new UnauthorizedException('Invalid JWT.');
      }
  
      return await this.userService.findById(payload.id);
    }
  }
  