import { Body, Controller, Get, Post, Put, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Serialize } from '../commons/interceptors/serialize.interceptor';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
@ApiTags('auth')
@Serialize(UserResponseDto)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/register')
  async register(
    @Res({ passthrough: true }) response: Response,
    @Body() registerDto: RegisterDto,
  ) {
    return await this.authService.register(registerDto, response);
  }

  @Post('/login')
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() loginDto: LoginDto,
  ) {
    return await this.authService.login(response, loginDto);
  }

  @Post('/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    return await this.authService.logout(response);
  }

  @Get('me')
  @Auth()
  async getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @Put('me')
  @Auth()
  async updateCurrentUser(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(user.id, updateUserDto);
  }
}
