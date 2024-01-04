import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import GenericRepository from 'src/shared/repository';

export type CreateOrderDto = Omit<Order, 'id'>;

@Injectable()
export default class OrderRepository extends GenericRepository<
  Order,
  CreateOrderDto
> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findOne(id: string): Promise<Order> {
    return this.prisma.findOrder(id);
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    return this.prisma.createOrder(dto);
  }
}