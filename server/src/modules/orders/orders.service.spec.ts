import { Test, TestingModule } from '@nestjs/testing';
import { OrderEntity } from '@/database/entities/order.entity';
import { CustomerEntity } from '@/database/entities/customer.entity';
import { StoreEntity } from '@/database/entities/store.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

import { OrdersService } from './orders.service';
import {
  ERROR_INSUFFICIENT_BALANCE,
  ERROR_ORDER_NOT_ELIGIBLE,
  ERROR_ORDER_NOT_FOUND,
  ERROR_STORE_NOT_FOUND,
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_PENDING,
} from './constants';

describe('OrdersService', () => {
  let service: OrdersService;
  const mockOrderRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
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
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<OrdersService>(OrdersService);
    mockStoreRepository.findOneBy.mockClear();
    mockOrderRepository.findOneBy.mockClear();
  });

  describe('cancelOrder', () => {
    it('should cancel order with no refund', async () => {
      const mockOrder = { id: 1, status: ORDER_STATUS_PENDING };
      mockOrderRepository.findOneBy.mockResolvedValue(mockOrder);
      const result = await service.cancelOrder(1, false);
      mockOrderRepository.update.mockResolvedValue({ affected: 1, raw: {} });
      expect(mockOrderRepository.update).toHaveBeenCalledWith(1, {
        status: 'cancelled',
      });
      expect(result).toEqual(mockOrder);
    });

    it('should cancel order with refund and available balance', async () => {
      const mockOrder = {
        id: 1,
        store_id: 1,
        amount_cents: 100,
        status: 'pendingPayment',
      };
      const mockStore = { id: 1, balance_cents: 100 };
      mockOrderRepository.findOneBy.mockResolvedValue(mockOrder);
      mockStoreRepository.findOneBy.mockResolvedValue(mockStore);
      const result = await service.cancelOrder(1, true);
      mockOrderRepository.update.mockResolvedValue({ affected: 1, raw: {} });
      expect(mockOrderRepository.update).toHaveBeenCalledWith(1, {
        status: ORDER_STATUS_CANCELLED,
      });
      expect(mockStoreRepository.update).toHaveBeenCalledWith(1, {
        balance_cents: mockStore.balance_cents - mockOrder.amount_cents,
      });
      expect(mockStoreRepository.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockOrder);
    });

    it('should throw Insufficient balance error if store balance is not enough', async () => {
      const mockOrder = {
        id: 1,
        store_id: 1,
        amount_cents: 100,
        status: 'pendingPayment',
      };
      const mockStore = { id: 1, balance_cents: 50 };
      mockOrderRepository.findOneBy.mockResolvedValue(mockOrder);
      mockStoreRepository.findOneBy.mockResolvedValue(mockStore);
      await expect(service.cancelOrder(1, true)).rejects.toThrow(
        ERROR_INSUFFICIENT_BALANCE,
      );
    });
  });
  it('should handle error order not found', async () => {
    mockOrderRepository.findOneBy.mockResolvedValue(null);
    await expect(service.cancelOrder(1, false)).rejects.toThrow(
      ERROR_ORDER_NOT_FOUND,
    );
    expect(mockOrderRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should handle error store not found', async () => {
    const mockOrder = { id: 1, store_id: 1, status: ORDER_STATUS_PENDING };
    mockOrderRepository.findOneBy.mockResolvedValue(mockOrder);
    mockStoreRepository.findOneBy.mockResolvedValue(null);
    await expect(service.cancelOrder(1, true)).rejects.toThrow(
      ERROR_STORE_NOT_FOUND,
    );
    expect(mockOrderRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(mockStoreRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });
  it('should throw Order not eligible for cancellation if order status is already cancelled', async () => {
    const mockOrder = { id: 1, status: ORDER_STATUS_CANCELLED };
    mockOrderRepository.findOneBy.mockResolvedValue(mockOrder);
    await expect(service.cancelOrder(1, false)).rejects.toThrow(
      ERROR_ORDER_NOT_ELIGIBLE,
    );
  });
});
