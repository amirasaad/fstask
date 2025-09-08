import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { StoreEntity } from '@/database/entities/store.entity';
import { OrderEntity } from '@/database/entities/order.entity';
import { CustomerEntity } from '@/database/entities/customer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('OrdersController', () => {
  let ordersController: OrdersController;

  const mockOrderRepository = {
    findOneBy: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
  };

  const mockStoreRepository = {
    findOneBy: jest.fn(),
    update: jest.fn(),
  };
  const mockCustomerRepository = {
    findOneBy: jest.fn(),
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
        {
          provide: getRepositoryToken(CustomerEntity),
          useValue: mockCustomerRepository,
        },
        {
          provide: getRepositoryToken(StoreEntity),
          useValue: mockStoreRepository,
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

    describe('cancelOrder', () => {
      it('should cancel without refund', async () => {
        mockOrderRepository.findOneBy.mockResolvedValue({
          id: 1,
          status: 'pendingPayment',
        });
        expect(await ordersController.cancelOrder(1, { refund: false }));
      });
    });
  });
});
