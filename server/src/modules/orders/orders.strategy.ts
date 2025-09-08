import { OrderEntity } from '@/database/entities/order.entity';
import { Repository } from 'typeorm';
import { StoreEntity } from '@/database/entities/store.entity';
import {
  ORDER_STATUS_CANCELLED,
  ERROR_STORE_NOT_FOUND,
  ERROR_INSUFFICIENT_BALANCE,
} from './constants';

export interface CancellationStrategy {
  cancel(order: OrderEntity): Promise<void>;
}

export class CancellationWithoutRefund implements CancellationStrategy {
  constructor(private ordersRepo: Repository<OrderEntity>) {}

  async cancel(order: OrderEntity): Promise<void> {
    await this.ordersRepo.update(order.id, { status: ORDER_STATUS_CANCELLED });
  }
}

export class CancellationWithRefund implements CancellationStrategy {
  constructor(
    private ordersRepo: Repository<OrderEntity>,
    private storesRepo: Repository<StoreEntity>,
  ) {}

  async cancel(order: OrderEntity): Promise<void> {
    const store = await this.storesRepo.findOneBy({ id: order.store_id });
    if (!store) throw new Error(ERROR_STORE_NOT_FOUND);
    if (store.balance_cents < order.amount_cents)
      throw new Error(ERROR_INSUFFICIENT_BALANCE);

    await this.storesRepo.update(store.id, {
      balance_cents: store.balance_cents - order.amount_cents,
    });

    await this.ordersRepo.update(order.id, { status: ORDER_STATUS_CANCELLED });
  }
}
