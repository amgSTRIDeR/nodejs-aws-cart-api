import { Injectable } from '@nestjs/common';
import { Cart, CartItem, Product, CartStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import GenericRepository from 'src/shared/repository';

export type CreateCartDto = Pick<Cart, 'user_id'>;
export type UpsertCartItemDto = CartItem;
export type UpsertProductDto = Product;

@Injectable()
export default class CartRepository extends GenericRepository<
  Cart,
  CreateCartDto
> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findOne(id: string): Promise<Cart> {
    return this.prisma.findCart(id);
  }

  async findOneByUserId(userId: string): Promise<Cart> {
    return this.prisma.findCartByUserId(userId);
  }

  async create(dto: CreateCartDto): Promise<Cart> {
    return this.prisma.createCart(dto);
  }

  async upsertProduct(dto: UpsertProductDto): Promise<Product> {
    return this.prisma.upsertProduct(dto);
  }

  async upsertCartItem(dto: UpsertCartItemDto): Promise<Cart> {
    return this.prisma.upsertCartItem(dto);
  }
}