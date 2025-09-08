import { DataSource } from 'typeorm';
import { OrderEntity } from '@/database/entities/order.entity';

export const ordersFixture: Partial<OrderEntity>[] = [
  {
    id: 1,
    store_id: 1,
    customer_id: 1,
    status: 'confirmed',
    amount_cents: 1500,
    created_at: new Date('2024-01-01T10:00:00Z'),
    updated_at: new Date('2024-01-01T10:00:00Z'),
  },
  {
    id: 2,
    store_id: 2,
    customer_id: 2,
    status: 'pendingPayment',
    amount_cents: 2500,
    created_at: new Date('2024-02-01T12:00:00Z'),
    updated_at: new Date('2024-02-01T12:00:00Z'),
  },
];

export async function seedOrders(dataSource: DataSource) {
  const repo = dataSource.getRepository(OrderEntity);
  await repo.clear();
  const entities = repo.create(ordersFixture as OrderEntity[]);
  await repo.save(entities);
  return entities;
}

export async function clearOrders(dataSource: DataSource) {
  const repo = dataSource.getRepository(OrderEntity);
  await repo.clear();
}
