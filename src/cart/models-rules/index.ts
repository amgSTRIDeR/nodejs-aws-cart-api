import { Cart, CartItem } from '../cart.entity';

/**
 * @param {Cart} cart
 * @returns {number}
 */
export function calculateCartTotal(cart: Cart): number {
  return cart
    ? cart.items.reduce((acc: number, { product, count }: CartItem) => {
        return (acc += product.price * count);
      }, 0)
    : 0;
}