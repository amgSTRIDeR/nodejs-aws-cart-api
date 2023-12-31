import { Module } from '@nestjs/common';

import { UsersService } from './services';
import { PrismaModule } from 'src/prisma/prisma.module';
import UserRepository from './users.repository';

@Module({
  imports: [PrismaModule],
  providers: [ UsersService, UserRepository ],
  exports: [ UsersService ],
})
export class UsersModule {}
