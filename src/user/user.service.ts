import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { RegisterDto } from '../auth/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string) {
    const user: User = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException("User with given id doesn't exist.");
    }
    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async create(registerDto: RegisterDto) {
    const user = this.userRepository.create(registerDto);
    return await this.userRepository.save(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ) {
    const user: User = await this.findById(id);
    Object.assign(user, updateUserDto);
    if (updateUserDto.oldPassword) {
      if (!updateUserDto.newPassword) {
        throw new BadRequestException('New password is not given');
      }
      if (!(await bcrypt.compare(updateUserDto.oldPassword, user.password))) {
        throw new BadRequestException('Old password is wrong');
      }
      if (await bcrypt.compare(updateUserDto.newPassword, user.password)) {
        throw new BadRequestException(
          "New password can't be the same with current password.",
        );
      }
      user.password = await bcrypt.hash(updateUserDto.newPassword, 10);
    }
    return await this.userRepository.save(user);
  }
}
