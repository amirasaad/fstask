import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrderEntity } from '@/database/entities/order.entity';
import { StoreEntity } from '@/database/entities/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '@/database/entities/customer.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customersRepository: Repository<CustomerEntity>,
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
    @InjectRepository(StoreEntity)
    private storesRepository: Repository<StoreEntity>,
  ) {}

  listOrders(): Promise<OrderEntity[]> {
    return this.ordersRepository.find({ relations: ['store', 'customer'] });
  }

  async cancelOrder(id: number, refund: boolean): Promise<OrderEntity | null> {
    const order = await this.ordersRepository.findOneBy({ id });
    if (!order) throw new Error('Order not found');

    if (refund) {
      await this.processRefund(order);
    }

    await this.ordersRepository.update(id, { status: 'cancelled' });
    return order;
  }

  private async processRefund(order: OrderEntity) {
    const store = await this.storesRepository.findOneBy({ id: order.store_id });
    if (!store) throw new Error('Store not found');
    if (store.balance_cents < order.amount_cents)
      throw new Error('Insufficient balance');

    await this.storesRepository.update(store.id, {
      balance_cents: store.balance_cents - order.amount_cents,
    });
  }
}
