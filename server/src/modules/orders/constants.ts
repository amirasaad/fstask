export const ORDER_STATUS_CANCELLED = 'cancelled' as const;
export const ORDER_STATUS_PENDING = 'pendingPayment' as const;

export const ORDER_RELATIONS = ['store', 'customer'] as const;

export const ERROR_ORDER_NOT_FOUND = 'Order not found';
export const ERROR_STORE_NOT_FOUND = 'Store not found';
export const ERROR_INSUFFICIENT_BALANCE = 'Insufficient balance';
export const ERROR_ORDER_NOT_ELIGIBLE = 'Order not eligible for cancellation';
