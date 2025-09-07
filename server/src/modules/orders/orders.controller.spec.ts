import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderEntity } from '@/database/entities/order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('OrdersController', () => {
  let ordersController: OrdersController;

  const mockOrderRepository = {
    findOneBy: jest.fn(),
    find: jest.fn(),
  };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    ordersController = app.get<OrdersController>(OrdersController);
  });

  describe('listOrders', () => {
    mockOrderRepository.find.mockReturnValue([
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ]);
    it('should return orders', async () => {
      expect(await ordersController.listOrders()).toHaveLength(3);
    });
  });

  describe('cancelOrder', () => {
    it('should delete without refund', async () => {
      expect(await ordersController.cancelOrder(1, { refund: false }));
    });
  });
});
