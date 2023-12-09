import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entities/user.entity';
import { Wish } from './entities/wish.entity';
import { NOT_FOUND_GENERAL, WISH_OWNER_FORBIDDEN } from '../utils/consts';
import { FindOneOptions } from 'typeorm';


@ApiTags('wishes')
@ApiBearerAuth()
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) { }


  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new wish' })
  @ApiResponse({
    status: 201,
    description: 'Wish created',
    type: CreateWishDto,
  })
  @ApiBody({ type: CreateWishDto })
  @ApiForbiddenResponse({ description: WISH_OWNER_FORBIDDEN })
  @Post()
  async createWish(
    @Body() createWishDto: CreateWishDto,
    @Request() req: Request & { user: User },
  ) {
    return this.wishesService.create(createWishDto, req.user.id);
  }


  @ApiOperation({ summary: 'Get the most recent wishes' })
  @ApiResponse({
    status: 200,
    description: 'Recent wishes retrieved',
    type: [Wish],
  })
  @Get('/last')
  async getLastWishes(): Promise<Wish[]> {
    return this.wishesService.getRecentWishes();
  }


  @ApiOperation({ summary: 'Get the most popular wishes' })
  @ApiResponse({
    status: 200,
    description: 'Popular wishes retrieved',
    type: [Wish],
  })
  @Get('/top')
  async getPopularWishes(): Promise<Wish[]> {
    return this.wishesService.getPopularWishes();
  }


  @Get(':id')
  async findWishById(@Param('id') id: string) {
    // Создаем объект FindOneOptions, указывая условия поиска
    const query: FindOneOptions<Wish> = {
      where: { id: +id }, // Преобразование строки в число
      // можно добавить другие параметры, например, relations, если нужно
    };

    // Передаем объект query в метод findWish сервиса
    return this.wishesService.findWish(query);
  }


  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a wish by ID' })
  @ApiResponse({
    status: 200,
    description: 'Wish updated',
    type: UpdateWishDto,
  })
  @ApiParam({ name: 'id', description: 'ID of the wish to update' })
  @ApiBody({ type: UpdateWishDto })
  @ApiNotFoundResponse({ description: NOT_FOUND_GENERAL }) // Если желание не найдено
  @ApiForbiddenResponse({ description: WISH_OWNER_FORBIDDEN }) // Если попытка обновить не своё желание
  @Patch(':id')
  async updateOne(
    @Request() req,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<NonNullable<unknown>> {
    try {
      const userId = req.user.id;
      return await this.wishesService.updateWish(id, updateWishDto, userId);
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a wish by ID' })
  @ApiResponse({ status: 204, description: 'Wish deleted' })
  @ApiParam({ name: 'id', description: 'ID of the wish to delete' })
  @ApiNotFoundResponse({ description: NOT_FOUND_GENERAL }) // Если желание не найдено
  @ApiForbiddenResponse({ description: WISH_OWNER_FORBIDDEN }) // Если попытка удалить не своё желание
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req: Request & { user: User },
  ) {
    return this.wishesService.remove(+id, req.user.id);
  }


  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Copy a wish by ID' })
  @ApiResponse({ status: 201, description: 'Wish copied', type: Wish })
  @ApiParam({ name: 'id', description: 'ID of the wish to copy' })
  @Post(':id/copy')
  async copyWish(
    @Param('id') wishId: string,
    @Request() req: Request & { user: User },
  ): Promise<Wish> {
    return this.wishesService.copyWish(+wishId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Search for wishes by description or name' })
  @ApiResponse({ status: 200, description: 'Wishes found', type: [Wish] })
  @ApiParam({
    name: 'description',
    required: false,
    description: 'Search wishes by description',
  })
  @ApiParam({
    name: 'name',
    required: false,
    description: 'Search wishes by name',
  })
  @Get('/search')
  async findWishes(
    @Query('description') description: string,
    @Query('name') name: string,
  ): Promise<Wish[]> {
    if (description) {
      return this.wishesService.searchWishesByDescription(description);
    }
    if (name) {
      return this.wishesService.searchWishesByName(name);
    } else {
      return [];
    }
  }
}
