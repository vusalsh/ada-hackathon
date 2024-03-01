import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { Response } from 'express';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import jwtConstants from './constants/jwt.constant';
import expirationConstants from './constants/token-expiration.constant';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { JwtTokensDto } from './dto/jwt-tokens.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
config();

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  private jwtSignToken(jwtPayload: JwtPayloadDto) {
    return {
      accessToken: this.jwtService.sign(jwtPayload, {
        expiresIn: expirationConstants.accessExpiration,
        secret: jwtConstants.accessSecret,
      }),
    };
  }

  async register(registerDto: RegisterDto, response: Response = null) {
    const existingUser: User = await this.userService.findByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('User with given email exists.');
    }

    registerDto.password = await bcrypt.hash(registerDto.password, 10);

    const user: User = await this.userService.create(registerDto);

    if (response) {
      const authTokens: JwtTokensDto = this.jwtSignToken({
        id: user.id,
        email: user.email,
      });
      response.status(200).cookie('accessToken', authTokens.accessToken, {
        httpOnly: true,
        maxAge: expirationConstants.accessExpirationInSecs * 1000,
        sameSite: 'none',
        secure: true,
      });
    }
    return user;
  }
  async login(response: Response, loginDto: LoginDto) {
    const user: User = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new BadRequestException("User with given email doesn't exist.");
    }

    if (!(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Email or password is wrong.');
    }

    const authTokens: JwtTokensDto = this.jwtSignToken({
      id: user.id,
      email: user.email,
    });

    response.status(200).cookie('accessToken', authTokens.accessToken, {
      httpOnly: true,
      maxAge: expirationConstants.accessExpirationInSecs * 1000,
      sameSite: 'none',
      secure: true,
    });

    return user;
  }

  async logout(response: Response) {
    try {
      response.clearCookie('accessToken');
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
