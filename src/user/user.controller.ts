import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Serialize } from '../commons/interceptors/serialize.interceptor';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags("user")
@Serialize(UserResponseDto)
export class UserController {
  constructor(private readonly userService: UserService) {}
}
