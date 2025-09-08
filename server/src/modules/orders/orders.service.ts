import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrderEntity } from '@/database/entities/order.entity';
import {
  ORDER_RELATIONS,
  ORDER_STATUS_CANCELLED,
  ERROR_ORDER_NOT_FOUND,
  ERROR_ORDER_NOT_ELIGIBLE,
  ERROR_STORE_NOT_FOUND,
  ERROR_INSUFFICIENT_BALANCE,
} from './constants';
import { StoreEntity } from '@/database/entities/store.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
    @InjectRepository(StoreEntity)
    private storesRepository: Repository<StoreEntity>,
  ) {}

  listOrders(): Promise<OrderEntity[]> {
    return this.ordersRepository.find({ relations: [...ORDER_RELATIONS] });
  }

  async cancelOrder(id: number, refund: boolean): Promise<OrderEntity | null> {
    const order = await this.ordersRepository.findOneBy({ id });
    if (!order) throw new Error(ERROR_ORDER_NOT_FOUND);
    if (!this.isEligibleForCancellation(order))
      throw new Error(ERROR_ORDER_NOT_ELIGIBLE);

    if (refund) await this.processRefund(order);

    await this.ordersRepository.update(id, { status: ORDER_STATUS_CANCELLED });
    return order;
  }

  private async processRefund(order: OrderEntity) {
    const store = await this.storesRepository.findOneBy({ id: order.store_id });
    if (!store) throw new Error(ERROR_STORE_NOT_FOUND);
    if (store.balance_cents < order.amount_cents)
      throw new Error(ERROR_INSUFFICIENT_BALANCE);

    await this.storesRepository.update(store.id, {
      balance_cents: store.balance_cents - order.amount_cents,
    });
  }

  private isEligibleForCancellation(order: OrderEntity): boolean {
    return order.status !== ORDER_STATUS_CANCELLED;
  }
}
