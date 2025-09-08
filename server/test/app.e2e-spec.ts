import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { OrdersModule } from '@/modules/orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '@/database/entities/order.entity';
import { DataSource } from 'typeorm';
import { seedOrders, clearOrders } from './fixtures/orders';
import { clearCustomers, seedCustomers } from './fixtures/customers';
import { clearStores, seedStores } from './fixtures/stores';
import { CustomerEntity } from '@/database/entities/customer.entity';
import { StoreEntity } from '@/database/entities/store.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [OrderEntity, CustomerEntity, StoreEntity],
          synchronize: true,
          logging: false,
        }),
        OrdersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = app.get<DataSource>(DataSource);
    await seedCustomers(dataSource);
    await seedStores(dataSource);
    await seedOrders(dataSource);
  });

  afterEach(async () => {
    if (dataSource) {
      await clearOrders(dataSource);
      await clearCustomers(dataSource);
      await clearStores(dataSource);
    }
    if (app) await app.close();
  });

  it('/orders/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/orders')
      .expect(200)
      .then((res) => {
        const body = res.body as any[];
        expect(Array.isArray(body)).toBe(true);
        body.forEach((order: Partial<OrderEntity>) => {
          expect(order).toHaveProperty('store');
          expect(order.store).toHaveProperty('name');
        });
      });
  });
  describe('/orders/{id} (DELETE)', () => {
    it('cancel order with refund', () => {
      return request(app.getHttpServer())
        .delete('/orders/1')
        .send({ refund: true })
        .expect(200);
    });
    it('/orders/{id} (DELETE)', () => {
      return request(app.getHttpServer())
        .delete('/orders/1')
        .send({ refund: true })
        .expect(200);
    });
  });
});
