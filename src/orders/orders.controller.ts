import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Inject,
    ParseUUIDPipe,
    Query,
    Patch,
} from '@nestjs/common';

import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';

@Controller('orders')
export class OrdersController {
    constructor(
        @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy,
    ) {}

    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersClient.send({ cmd: 'create_order' }, createOrderDto);
    }

    @Get()
    findAll(@Query() orderPaginationDto: OrderPaginationDto) {
        return this.ordersClient.send({ cmd: 'find_all' }, orderPaginationDto);
    }

    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        try {
            const order = await firstValueFrom(
                this.ordersClient.send({ cmd: 'find_one_order' }, { id }),
            );

            return order;
        } catch (error) {
            throw new RpcException(error);
        }
    }

    @Patch(':id')
    changeStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() statusDto: StatusDto,
    ) {
        try {
            return this.ordersClient.send(
                { cmd: 'change_order_status' },
                { id, status: statusDto.status },
            );
        } catch (error) {
            throw new RpcException(error);
        }
    }
}
