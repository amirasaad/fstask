import { Test, TestingModule } from '@nestjs/testing';
import { OrderEntity } from '@/database/entities/order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

import { OrdersService } from './orders.service';
describe('OrdersService', () => {
  let service: OrdersService;
  const mockOrderRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  describe('cancelOrder', () => {
    it('should delete order', async () => {
      const mockOrder = { id: 1 };
      mockOrderRepository.findOneBy.mockResolvedValue(mockOrder);
      const result = await service.cancelOrder(1, false);
      expect(result).toEqual(mockOrder);
    });
  });
});
