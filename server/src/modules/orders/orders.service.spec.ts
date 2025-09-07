import { Test, TestingModule } from '@nestjs/testing';
import { OrderEntity } from '@/database/entities/order.entity';
import { StoreEntity } from '@/database/entities/store.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;
  const mockOrderRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
  const mockStoreRepository = {
    findOneBy: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(StoreEntity),
          useValue: mockStoreRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  describe('cancelOrder', () => {
    it('should delete order with no refund', async () => {
      const mockOrder = { id: 1 };
      mockOrderRepository.findOneBy.mockResolvedValue(mockOrder);
      const result = await service.cancelOrder(1, false);
      mockOrderRepository.delete.mockResolvedValue({ affected: 1, raw: {} });
      expect(mockOrderRepository.delete).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockOrder);
    });

    it('should delete order with refund and available balance', async () => {
      const mockOrder = { id: 1, store_id: 1, amount_cents: 100 };
      const mockStore = { id: 1, balance_cents: 100 };
      mockOrderRepository.findOneBy.mockResolvedValue(mockOrder);
      mockStoreRepository.findOneBy.mockResolvedValue(mockStore);
      const result = await service.cancelOrder(1, true);
      mockOrderRepository.delete.mockResolvedValue({ affected: 1, raw: {} });
      expect(mockOrderRepository.delete).toHaveBeenCalledWith({ id: 1 });
      expect(mockStoreRepository.update).toHaveBeenCalledWith(1, {
        balance_cents: mockStore.balance_cents - mockOrder.amount_cents,
      });
      expect(mockStoreRepository.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockOrder);
    });

    it('should throw Insufficient balance error if store balance is not enough', async () => {
      const mockOrder = { id: 1, store_id: 1, amount_cents: 100 };
      const mockStore = { id: 1, balance_cents: 50 };
      mockOrderRepository.findOneBy.mockResolvedValue(mockOrder);
      mockStoreRepository.findOneBy.mockResolvedValue(mockStore);
      await expect(service.cancelOrder(1, true)).rejects.toThrow(
        'Insufficient balance',
      );
    });
  });
});
