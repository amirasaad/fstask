import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { OrdersModule } from '@/modules/orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '@/database/entities/order.entity';
import { DataSource } from 'typeorm';
import { seedOrders, clearOrders } from './fixtures/orders';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [OrderEntity],
          synchronize: true,
          logging: false,
        }),
        OrdersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = app.get<DataSource>(DataSource);
    await seedOrders(dataSource);
  });

  afterEach(async () => {
    if (dataSource) await clearOrders(dataSource);
    if (app) await app.close();
  });

  it('/orders/ (GET)', () => {
    return request(app.getHttpServer()).get('/orders').expect(200);
  });
  it('/orders/{id} (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/orders/1')
      .send({ refund: true })
      .expect(200);
  });
});
