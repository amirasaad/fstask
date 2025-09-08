import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrderEntity } from '@/database/entities/order.entity';
import {
  ORDER_RELATIONS,
  ORDER_STATUS_ELIGIBLE_FOR_CANCELLATION,
  ERROR_ORDER_NOT_FOUND,
  ERROR_ORDER_NOT_ELIGIBLE,
} from './constants';
import { StoreEntity } from '@/database/entities/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CancellationWithoutRefund,
  CancellationWithRefund,
} from './orders.strategy';

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
    this.checkEligibleForCancellation(order);
    const strategy = refund
      ? new CancellationWithRefund(this.ordersRepository, this.storesRepository)
      : new CancellationWithoutRefund(this.ordersRepository);

    await strategy.cancel(order);
    return order;
  }

  private checkEligibleForCancellation(order: OrderEntity) {
    if (
      !ORDER_STATUS_ELIGIBLE_FOR_CANCELLATION.includes(
        order.status as (typeof ORDER_STATUS_ELIGIBLE_FOR_CANCELLATION)[number],
      )
    )
      throw new Error(ERROR_ORDER_NOT_ELIGIBLE);
  }
}
