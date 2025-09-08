import { Controller, Delete, Get, Param, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderEntity } from '@/database/entities/order.entity';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('orders')
  listOrders(): Promise<OrderEntity[]> {
    return this.ordersService.listOrders();
  }

  @Delete('orders/:id')
  cancelOrder(@Param('id') id: number, @Body() body: { refund: boolean }) {
    return this.ordersService.cancelOrder(id, body.refund);
  }
}
