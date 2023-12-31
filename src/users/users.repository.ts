import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import GenericRepository from 'src/shared/repository';

export type CreateUserDto = Omit<User, 'id' | 'email'>;

@Injectable()
export default class UserRepository extends GenericRepository<
  User,
  CreateUserDto
> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findOne(id: string): Promise<User> {
    return this.prisma.findUser(id);
  }

  async findOneByName(name: string): Promise<User> {
    return this.prisma.findUserByName(name);
  }

  async create(dto: CreateUserDto): Promise<User> {
    return this.prisma.createUser(dto);
  }
}