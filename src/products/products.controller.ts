import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
    constructor(
        @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
    ) {}

    @Post()
    createProduct(@Body() createProductDto: CreateProductDto) {
        return this.productsClient.send(
            { cmd: 'create_product' },
            createProductDto,
        );
    }

    @Get()
    findAllProducts(@Query() paginationDto: PaginationDto) {
        return this.productsClient.send({ cmd: 'find_all' }, paginationDto);
    }

    @Get(':id')
    findProduct(@Param('id') id: string) {
        return this.productsClient
            .send({ cmd: 'find_one_product' }, { id })
            .pipe(
                catchError((error) => {
                    throw new RpcException(error);
                }),
            );

        // The following code is a Promise style alternative to the above code:
        // try {
        //     const product = await firstValueFrom(
        //         this.productsClient.send({ cmd: 'find_one_product' }, { id }),
        //     );

        //     return product;
        // } catch (error) {
        //     // RpcException is the exception thrown by the products microservice
        //     throw new RpcException(error);
        // }
    }

    @Delete(':id')
    removeProduct(@Param('id') id: string) {
        return this.productsClient.send({ cmd: 'delete_product' }, { id }).pipe(
            catchError((error) => {
                throw new RpcException(error);
            }),
        );
    }

    @Patch(':id')
    updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProducDto: UpdateProductDto,
    ) {
        return this.productsClient
            .send({ cmd: 'update_product' }, { id, ...updateProducDto })
            .pipe(
                catchError((error) => {
                    throw new RpcException(error);
                }),
            );
    }
}
