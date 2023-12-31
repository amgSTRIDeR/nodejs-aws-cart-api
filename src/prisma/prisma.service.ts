import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Cart,
  CartStatus,
  Order,
  PrismaClient,
  Product,
  User,
} from '@prisma/client';
import {
  CreateCartDto,
  UpsertCartItemDto,
  UpsertProductDto,
} from 'src/cart/cart.repository';
import { CreateOrderDto } from 'src/order/order.repository';
import { CreateUserDto } from 'src/users/users.repository';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PrismaService implements OnModuleInit {
  private readonly prisma = new PrismaClient();

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async findUser(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findOrder(id: string): Promise<Order> {
    return this.prisma.order.findUnique({
      where: {
        id,
      },
    });
  }

  async findUserByName(name: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        name,
      },
    });
  }

  async findCart(id: string): Promise<Cart> {
    const foundCart = await this.prisma.cart.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return foundCart;
  }

  async findCartByUserId(userId: string): Promise<Cart> {
    const foundCart = await this.prisma.cart.findFirst({
      where: { user_id: userId, status: CartStatus.OPEN },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return foundCart;
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        id: uuid(),
        ...userDto,
      },
    });
  }

  async createOrder(orderDto: CreateOrderDto): Promise<Order> {
    const [updatedCart, order] = await this.prisma.$transaction([
      this.prisma.cart.update({
        where: {
          id: orderDto.cart_id,
        },
        data: {
          status: CartStatus.ORDERED,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      }),
      this.prisma.order.create({
        data: {
          id: uuid(),
          ...orderDto,
        },
      }),
    ]);
    return order;
  }

  async createCart(cartDto: CreateCartDto): Promise<Cart> {
    const createdCart = await this.prisma.cart.create({
      data: {
        id: uuid(),
        ...cartDto,
      },
      include: {
        items: true,
      },
    });
    return createdCart;
  }

  async upsertProduct(dto: UpsertProductDto): Promise<Product> {
    const upsertedProduct = await this.prisma.product.upsert({
      where: {
        id: dto.id,
      },
      update: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
      },
      create: {
        id: dto.id,
        title: dto.title,
        description: dto.description,
        price: dto.price,
      },
    });
    return upsertedProduct;
  }

  async upsertCartItem({
    cart_id,
    product_id,
    count,
  }: UpsertCartItemDto): Promise<Cart> {
    const updatedCart = await this.prisma.cartItem.upsert({
      where: {
        cart_id_product_id: {
          cart_id,
          product_id,
        },
      },
      update: {
        count,
      },
      create: {
        cart_id,
        product_id,
        count,
      },
      include: {
        cart: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
    return updatedCart.cart;
  }
}