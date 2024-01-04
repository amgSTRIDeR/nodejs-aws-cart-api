import { Injectable } from '@nestjs/common';
import UserRepository, { CreateUserDto } from '../users.repository';
import { plainToInstance } from 'class-transformer';
import { User } from '../user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UserRepository) {}

  async findOne(userId: string): Promise<User> {
    return plainToInstance(User, await this.repository.findOne(userId));
  }

  async findOneByName(name: string): Promise<User> {
    return plainToInstance(User, await this.repository.findOneByName(name));
  }

  async createOne({ name, password }: CreateUserDto): Promise<User> {
    return plainToInstance(
      User,
      await this.repository.create({ name, password }),
    );
  }
}