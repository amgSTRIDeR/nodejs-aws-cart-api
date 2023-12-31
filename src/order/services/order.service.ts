import { Injectable } from '@nestjs/common';
import { Order } from '../order.entity';
import OrderRepository from '../order.repository';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class OrderService {
  constructor(private readonly repository: OrderRepository) {}

  async create(data: any): Promise<Order> {
    return plainToInstance(Order, await this.repository.create(data));
  }
}