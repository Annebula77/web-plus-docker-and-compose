import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Offer } from './entities/offer.entity';
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
import { NOT_FOUND_GENERAL, WISH_SELF_FORBIDDEN } from '../utils/consts';
import { UsersService } from '../users/users.service';

interface UserRequest extends Request {
  user: User;
}

@ApiTags('offers')
@ApiBearerAuth()
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService,
    private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new offer' })
  @ApiResponse({
    status: 201,
    description: 'The offer has been successfully created.',
    type: Offer,
  })
  @ApiBody({ type: CreateOfferDto })
  @ApiForbiddenResponse({ description: WISH_SELF_FORBIDDEN })
  @Post()
  async createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @Request() req: UserRequest,
  ) {
    const { id } = req.user;
    try {
      const user = await this.usersService.findOne(id);
      return await this.offersService.create(createOfferDto, user);
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all offers' })
  @ApiResponse({
    status: 200,
    description: 'Offers retrieved successfully.',
    type: [Offer],
  })
  @ApiNotFoundResponse({ description: NOT_FOUND_GENERAL })
  @Get()
  async getOffers(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get an offer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Offer retrieved successfully.',
    type: Offer,
  })
  @ApiParam({ name: 'id', type: 'string', description: 'Offer ID' })
  @Get(':id')
  async getOffer(@Param('id') id: string): Promise<Offer> {
    return this.offersService.findOne(+id);
  }
}
