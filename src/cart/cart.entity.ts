import { Exclude, Transform } from 'class-transformer';

export enum CartStatuses {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED',
}

export class Product {
  id: string;
  title: string;
  description: string;
  price: number;
}

export class CartItem {
  @Exclude()
  cart_id: string;
  @Exclude()
  product_id: string;
  product?: Product;
  cart?: Cart;
  count: number;
}

export class Cart {
  id: string;
  user_id: string;
  status: CartStatuses;
  items: CartItem[];

  @Transform(({ value }) => {
    return value instanceof Date ? value.getTime() : value;
  })
  created_at: number;

  @Transform(({ value }) => {
    return value instanceof Date ? value.getTime() : value;
  })
  updated_at: number;
}