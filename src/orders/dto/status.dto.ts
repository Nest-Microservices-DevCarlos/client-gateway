import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus, OrderStatusList } from '../enum/order.enum';

export class StatusDto {
    @IsOptional()
    @IsEnum(OrderStatusList, {
        message: `status must be one of the following values: ${OrderStatusList.join(', ')}`,
    })
    status: OrderStatus;
}
