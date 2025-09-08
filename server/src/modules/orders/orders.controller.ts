import {
  Controller,
  Delete,
  Get,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
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
  async cancelOrder(
    @Param('id') id: number,
    @Body() body: { refund: boolean },
  ) {
    try {
      await this.ordersService.cancelOrder(id, body.refund);
    } catch (err: any) {
      if (err instanceof Error) {
        throw new HttpException(
          {
            message: err.message,
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
          {
            cause: err,
          },
        );
      } else {
        // Handle cases where the thrown value is not an Error object
        throw new HttpException({}, HttpStatus.INTERNAL_SERVER_ERROR, {
          cause: 'unknown error',
        });
      }
    }
  }
}
