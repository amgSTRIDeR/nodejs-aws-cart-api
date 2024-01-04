export enum OrderStatuses {
    IN_PROGRESS = 'IN_PROGRESS',
    PAID = 'PAID',
  }
  
  export class Order {
    id: string;
    userId: string;
    cartId: string;
    address: JSON;
    status: OrderStatuses;
    total: number;
  }