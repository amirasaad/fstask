export const ORDER_STATUS_CANCELLED = 'CANCELLED' as const;
export const ORDER_STATUS_PENDING = 'PENDINGPAYMENT' as const;
export const ORDER_STATUS_CONFIRMED = 'CONFIRMED' as const;

export const ORDER_RELATIONS = ['store', 'customer'] as const;

export const ERROR_ORDER_NOT_FOUND = 'Order not found';
export const ERROR_STORE_NOT_FOUND = 'Store not found';
export const ERROR_INSUFFICIENT_BALANCE = 'Insufficient balance';
export const ERROR_ORDER_NOT_ELIGIBLE = 'Order not eligible for cancellation';

export const ORDER_STATUS_ELIGIBLE_FOR_CANCELLATION = [
  ORDER_STATUS_PENDING,
  ORDER_STATUS_CONFIRMED,
] as const;
