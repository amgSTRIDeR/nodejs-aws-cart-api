import { Module } from '@nestjs/common';
import { OrderService } from './services';
import { PrismaModule } from 'src/prisma/prisma.module';
import OrderRepository from './order.repository';

@Module({
  imports: [PrismaModule],
  providers: [ OrderService, OrderRepository ],
  exports: [ OrderService ]
})
export class OrderModule {}
