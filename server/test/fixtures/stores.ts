import { DataSource } from 'typeorm';
import { StoreEntity } from '@/database/entities/store.entity';

export const storesFixture: Partial<StoreEntity>[] = [
  {
    id: 1,
    name: 'Test store 1',
    balance_cents: 1500,
    created_at: new Date('2024-01-01T10:00:00Z'),
    updated_at: new Date('2024-01-01T10:00:00Z'),
  },
  {
    id: 2,
    name: 'Test store 2',
    balance_cents: 2500,
    created_at: new Date('2024-02-01T12:00:00Z'),
    updated_at: new Date('2024-02-01T12:00:00Z'),
  },
];

export async function seedStores(dataSource: DataSource) {
  const repo = dataSource.getRepository(StoreEntity);
  await repo.clear();
  const entities = repo.create(storesFixture as StoreEntity[]);
  await repo.save(entities);
  return entities;
}

export async function clearStores(dataSource: DataSource) {
  const repo = dataSource.getRepository(StoreEntity);
  await repo.clear();
}
