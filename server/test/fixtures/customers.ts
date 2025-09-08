import { DataSource } from 'typeorm';
import { CustomerEntity } from '@/database/entities/customer.entity';

export const customersFixture: Partial<CustomerEntity>[] = [
  {
    id: 1,
    name: 'Example Customer 1',
    email: 'customer1@example.com',
    created_at: new Date('2024-01-01T10:00:00Z'),
    updated_at: new Date('2024-01-01T10:00:00Z'),
  },
  {
    id: 2,
    name: 'Example Customer 2',
    email: 'customer2@example.com',
    created_at: new Date('2024-01-01T10:00:00Z'),
    updated_at: new Date('2024-01-01T10:00:00Z'),
  },
];

export async function seedCustomers(dataSource: DataSource) {
  const repo = dataSource.getRepository(CustomerEntity);
  await repo.clear();
  const entities = repo.create(customersFixture as CustomerEntity[]);
  await repo.save(entities);
  return entities;
}

export async function clearCustomers(dataSource: DataSource) {
  const repo = dataSource.getRepository(CustomerEntity);
  await repo.clear();
}
