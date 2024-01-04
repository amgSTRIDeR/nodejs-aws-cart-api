import { Injectable } from '@nestjs/common';
import { Cart, CartItem } from '../cart.entity';
import CartRepository from '../cart.repository';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CartService {
  constructor(private readonly repository: CartRepository) {}

  async findByUserId(userId: string): Promise<Cart> {
    return plainToInstance(Cart, await this.repository.findOneByUserId(userId));
  }

  async createByUserId(userId: string): Promise<Cart> {
    return plainToInstance(
      Cart,
      await this.repository.create({ user_id: userId }),
    );
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, cartItem: CartItem): Promise<Cart> {
    const userCart = await this.findByUserId(userId);
    const upsertedProduct = await this.repository.upsertProduct(
      cartItem.product,
    );

    const updatedCart = plainToInstance(
      Cart,
      await this.repository.upsertCartItem({
        cart_id: userCart.id,
        product_id: upsertedProduct.id,
        count: cartItem.count,
      }),
    );
    return updatedCart;
  }
}